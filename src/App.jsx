import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProcessFlow from "./components/ProcessFlow";
import FileProcessor from "./components/FileProcessor";
import * as apiService from "./api";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [stepStatuses, setStepStatuses] = useState({
    0: "idle", // Upload
    1: "idle", // PDF to images
    2: "idle", // Sectioning
    3: "idle", // GPT processing
    4: "idle", // JSON structuring
    5: "idle", // XML generation
    6: "idle", // Zip creation
  });

  const fileInputRef = useRef(null);

  const steps = [
    "Upload PDF",
    "Convert to Images",
    "Section Images",
    "Process with GPT-4o",
    "Generate structured JSON",
    "Generate XML",
    "Create Package",
  ];

  const handleFileChange = (e) => {
    e.preventDefault(); // Prevent default form behavior
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      updateStepStatus(0, "complete");
      setCurrentStep(1);
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  const updateStepStatus = (step, status) => {
    setStepStatuses((prev) => ({
      ...prev,
      [step]: status,
    }));
  };

  const updateCurrentStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetProcess = () => {
    setFile(null);
    setFileName("");
    setCurrentStep(0);
    setProcessing(false);
    setError(null);
    setResults(null);
    setStepStatuses({
      0: "idle",
      1: "idle",
      2: "idle",
      3: "idle",
      4: "idle",
      5: "idle",
      6: "idle",
    });
  };

  const processFile = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      // Step 1: Convert PDF to images
      updateStepStatus(1, "processing");
      const convertResponse = await apiService.convertPdf(formData);
      updateStepStatus(1, "complete");
      updateCurrentStep();

      // Step 2: Section images
      updateStepStatus(2, "processing");
      const sectionResponse = await apiService.sectionImages(
        convertResponse.data.jobId
      );
      updateStepStatus(2, "complete");
      updateCurrentStep();

      // Step 3: Process with GPT-4o
      updateStepStatus(3, "processing");
      const gptResponse = await apiService.processGpt(
        convertResponse.data.jobId
      );
      updateStepStatus(3, "complete");
      updateCurrentStep();

      // Step 4: Structure JSON
      updateStepStatus(4, "processing");
      const jsonResponse = await apiService.structureJson(
        convertResponse.data.jobId
      );
      updateStepStatus(4, "complete");
      setResults(jsonResponse.data.json);
      updateCurrentStep();

      // Step 5: Generate XML
      updateStepStatus(5, "processing");
      const xmlResponse = await apiService.generateXml(
        convertResponse.data.jobId
      );
      updateStepStatus(5, "complete");
      updateCurrentStep();

      // Step 6: Create package
      updateStepStatus(6, "processing");
      const packageResponse = await apiService.createPackage(
        convertResponse.data.jobId,
        xmlResponse.data.xmlFilePath
      );
      updateStepStatus(6, "complete");
      setProcessing(false);
      updateCurrentStep();
    } catch (err) {
      console.error("Processing error:", err);
      setError(
        `Processing error: ${err.response?.data?.message || err.message}`
      );
      setProcessing(false);

      setStepStatuses((prev) => {
        const lastCompletedStep = Object.keys(prev).reduce((last, step) => {
          if (prev[step] === "complete") {
            return Math.max(last, step);
          }
          return last;
        }, 0);

        return { ...prev, [lastCompletedStep + 1]: "error" };
      });
    }
  };

  useEffect(() => {
    console.log("currentStep updated:", currentStep);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero triggerFileInput={triggerFileInput} processing={processing} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProcessFlow
          steps={steps}
          currentStep={currentStep}
          statuses={stepStatuses}
        />
        <FileProcessor
          file={file}
          fileName={fileName}
          error={error}
          processing={processing}
          results={results}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          resetProcess={resetProcess}
          processFile={processFile}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}
