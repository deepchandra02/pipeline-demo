from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import datetime
from utils.lib import *
from utils.image_splitter import *
from utils.gpt_chat import chat
from utils.form_creator import generate_af
from utils.packager import packager

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

pdfs_directory = "pipeline-ui-demo/backend/pdfs_to_be_converted"
images_directory = "pipeline-ui-demo/backend/images_of_pdfs"
json_outputs = "pipeline-ui-demo/backend/json_outputs"

# Ensure the directories exist
if not os.path.exists(images_directory):
    os.makedirs(images_directory)
if not os.path.exists(pdfs_directory):
    os.makedirs(pdfs_directory)
if not os.path.exists(json_outputs):
    os.makedirs(json_outputs)


@app.route("/api/convert-pdf", methods=["POST"])
def convert_pdf():
    if "file" not in request.files:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "ERR_NO_FILE_PART",
                        "message": "No file part in the request",
                    },
                }
            ),
            400,
        )

    file = request.files["file"]
    if file.filename == "":
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "ERR_NO_SELECTED_FILE",
                        "message": "No file selected",
                    },
                }
            ),
            400,
        )

    if not file.filename.endswith(".pdf"):
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "ERR_INVALID_FILE_TYPE",
                        "message": "File is not a PDF",
                    },
                }
            ),
            400,
        )

    filename = secure_filename(file.filename)
    pdf_path = os.path.join(pdfs_directory, filename)
    file.save(pdf_path)

    job_id = os.path.splitext(filename)[0]
    try:
        images_folder, page_count = pdf_to_images(pdf_path, images_directory)
        return jsonify(
            {
                "success": True,
                # "images_folder": images_folder,
                "jobId": job_id,
                "pageCount": page_count,
                "message": "PDF successfully converted to images",
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": {"code": "ERR_CONVERSION_FAILED", "message": str(e)},
            }
        )


@app.route("/api/section-images", methods=["POST"])
def section_images():
    data = request.get_json()
    job_id = data["jobId"]
    images_folder = os.path.join(images_directory, job_id)

    try:
        sections_directory = process_form_images(images_folder)
        section_count = len(os.listdir(sections_directory))
        return jsonify(
            {
                "success": True,
                "jobId": job_id,
                "sectionCount": section_count,
                "message": "Images successfully sectioned",
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": {"code": "ERR_SECTIONING_FAILED", "message": str(e)},
            }
        )


@app.route("/api/process-gpt", methods=["POST"])
def process_gpt():
    data = request.get_json()
    job_id = data["jobId"]
    sections_directory = os.path.join(images_directory, f"{job_id}/{job_id}_sections")

    form_json = {
        "form_code": "",
        "form_title": "",
        "last_modified_date": (
            datetime.datetime.now(datetime.timezone.utc).astimezone()
        ).isoformat(),
        "last_modified_by": "t794555",
        "sections": [],
    }

    try:
        total_cost = 0
        total_tokens = 0
        num_sections = 0
        for section in sorted(os.listdir(sections_directory)):
            isTitle = False
            section_path = os.path.join(sections_directory, section)
            if "title" in section:
                isTitle = True

            response, tokens, cost = chat(isTitle, section_path)
            total_cost += cost
            total_tokens += tokens
            num_sections += 1
            if isTitle:
                form_json["form_title"] = response["title"]
            else:
                form_json["sections"].append(response)

        form_code = os.path.splitext(os.path.basename(job_id))[0][0:4]
        form_json["form_code"] = form_code

        json_filename = f"{form_code}_input_for_af.json"
        output_file_path = os.path.join(json_outputs, json_filename)
        with open(output_file_path, "w") as json_file:
            json.dump(form_json, json_file, indent=4)

        return jsonify(
            {
                "success": True,
                "jobId": job_id,
                "formCode": form_code,
                "total_sections": num_sections,
                "total_cost": total_cost,
                "total_tokens": total_tokens,
                "message": "All sections processed with GPT-4o",
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": {"code": "ERR_PROCESSING_FAILED", "message": str(e)},
            }
        )


@app.route("/api/structure-json", methods=["POST"])
def structure_json():
    data = request.get_json()
    job_id = data.get("jobId")
    form_code = os.path.splitext(os.path.basename(job_id))[0][0:4]

    if not job_id or not form_code:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "ERR_MISSING_DATA",
                        "message": "Required data is missing.",
                    },
                }
            ),
            400,
        )

    output_file_path = os.path.join(json_outputs, f"{form_code}_input_for_af.json")

    try:
        with open(output_file_path, "r") as json_file:
            form_json = json.load(json_file)
        return jsonify(
            {
                "success": True,
                "jobId": job_id,
                "json": form_json,
                "message": "JSON successfully structured",
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "ERR_JSON_STRUCTURE_FAILED",
                    "message": str(e),
                },
            }
        )


@app.route("/api/generate-xml", methods=["POST"])
def generate_xml():
    data = request.get_json()
    job_id = data.get("jobId")

    if not job_id:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "ERR_MISSING_DATA",
                        "message": "Required data is missing.",
                    },
                }
            ),
            400,
        )

    form_code = os.path.splitext(os.path.basename(job_id))[0][0:4]
    json_file_path = os.path.join(json_outputs, f"{form_code}_input_for_af.json")
    try:

        # Generate the XML content from the JSON data
        content_xml = generate_af(json_file_path)

        # Define the path for the XML file
        xml_file_path = os.path.join(json_outputs, f"{form_code}_content.xml")

        # Write the XML content to a file
        with open(xml_file_path, "w") as xml_file:
            xml_file.write(content_xml)

        return jsonify(
            {
                "success": True,
                "jobId": job_id,
                "xmlFilePath": xml_file_path,
                "message": "XML successfully generated",
            }
        )
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": {"code": "ERR_XML_GENERATION_FAILED", "message": str(e)},
            }
        )


@app.route("/api/create-package", methods=["POST"])
def create_package():
    data = request.get_json()
    job_id = data.get("jobId")
    xml_file_path = data.get("xmlFilePath")

    if not job_id or not xml_file_path:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {
                        "code": "ERR_MISSING_DATA",
                        "message": "Required data is missing.",
                    },
                }
            ),
            400,
        )

    form_code = os.path.splitext(os.path.basename(job_id))[0][0:4]
    json_file_path = os.path.join(json_outputs, f"{form_code}_input_for_af.json")

    try:
        # Read the JSON data from the file
        with open(json_file_path, "r") as json_file:
            form_json = json.load(json_file)

        # Step 9: Create the crx package for this form
        packager(form_code, form_json["last_modified_date"])

        # Step 10: Replace the content.xml with the generated one
        content_xml_file_path = f"experiment outputs/{form_code}/jcr_root/content/forms/af/deep_test_2/{form_code.lower()}/.content.xml"
        with open(content_xml_file_path, "w") as file:
            file.write(open(xml_file_path).read())

        # Step 11: Create a copy of the blank zipped file with form_code name
        copy_and_rename_zip_file(
            "blank_zipped_file.zip", "experiment outputs", form_code
        )

        # Step 12: Move the folders from source folder into the zipped folder
        move_folder_to_zip(
            f"experiment outputs/{form_code}", f"experiment outputs/{form_code}.zip"
        )

        return jsonify(
            {
                "success": True,
                "jobId": job_id,
                "message": "Package successfully created",
            }
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "error": {"code": "ERR_PACKAGE_CREATION_FAILED", "message": str(e)},
                }
            ),
            500,
        )


@app.route("/")
def home():
    return """<!doctype html><html lang="en"><body><div class="container"><h1>Welcome to the Flask API</h1></div></body></html>"""


if __name__ == "__main__":
    app.run(debug=True)
