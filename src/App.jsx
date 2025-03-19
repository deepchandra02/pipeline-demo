// src/App.jsx
import { useState, useRef } from "react";
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
  const [downloadUrl, setDownloadUrl] = useState(null);
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
    "Structure JSON",
    "Generate XML",
    "Create Package",
  ];

  const handleFileChange = (e) => {
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
    setDownloadUrl(null);
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
      formData.append("pdf", file);

      // Step 1: Convert PDF to images
      updateStepStatus(1, "processing");
      const convertResponse = await apiService.convertPdf(formData);
      updateStepStatus(1, "complete");
      setCurrentStep(2);

      // Step 2: Section images
      updateStepStatus(2, "processing");
      const sectionResponse = await apiService.sectionImages(
        convertResponse.data.jobId
      );
      updateStepStatus(2, "complete");
      setCurrentStep(3);

      // Step 3: Process with GPT-4o
      updateStepStatus(3, "processing");
      const formCode = fileName.split(".")[0]; // Assuming form code is the filename without extension
      const gptResponse = await apiService.processGpt(
        convertResponse.data.jobId,
        formCode
      );
      updateStepStatus(3, "complete");
      setCurrentStep(4);

      // Step 4: Structure JSON
      updateStepStatus(4, "processing");
      const jsonResponse = await apiService.structureJson(
        convertResponse.data.jobId
      );
      updateStepStatus(4, "complete");
      setCurrentStep(5);
      setResults(jsonResponse.data.json);

      // Step 5: Generate XML
      updateStepStatus(5, "processing");
      const xmlResponse = await apiService.generateXml(
        convertResponse.data.jobId
      );
      updateStepStatus(5, "complete");
      setCurrentStep(6);

      // Step 6: Create package
      updateStepStatus(6, "processing");
      const packageResponse = await apiService.createPackage(
        convertResponse.data.jobId
      );
      updateStepStatus(6, "complete");

      setDownloadUrl(apiService.getDownloadUrl(packageResponse.data.packageId));
      setProcessing(false);
    } catch (err) {
      setError(
        `Processing error: ${err.response?.data?.message || err.message}`
      );
      setProcessing(false);
      updateStepStatus(currentStep, "error");
    }
  };

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
          downloadUrl={downloadUrl}
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
