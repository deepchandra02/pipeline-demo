// src/components/ProcessUI.jsx
import { useState } from "react";

export default function ProcessUI({
  steps,
  currentStep,
  statuses,
  file,
  fileName,
  results,
  processingData,
  setCurrentStep,
}) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Function to render the step icon based on status
  const renderStepIcon = (status) => {
    switch (status) {
      case "processing":
        return (
          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="animate-spin h-6 w-6 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        );
      case "complete":
        return (
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-semibold text-lg">
              {steps.indexOf(steps[currentStep]) + 1}
            </span>
          </div>
        );
    }
  };

  // Detailed process content for each step
  const renderProcessContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Upload PDF
        return file ? (
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">
              PDF Document Details
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">File name:</span>
                <span className="font-medium">{fileName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">File size:</span>
                <span className="font-medium">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">File type:</span>
                <span className="font-medium">{file.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Last modified:</span>
                <span className="font-medium">
                  {new Date(file.lastModified).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Form code:</span>
                <span className="font-medium">{fileName.split(".")[0]}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Upload PDF file to begin processing</p>
          </div>
        );
      case 1: // Convert to Images
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Converting PDF to images...</p>
          </div>
        );
      case 2: // Section Images
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Sectioning images into parts...</p>
          </div>
        );
      case 3: // Process with GPT-4o
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Processing with GPT-4o...</p>
          </div>
        );
      case 4: // Generate structured JSON
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Generating structured JSON...</p>
          </div>
        );
      case 5: // Generate XML
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Generating XML...</p>
          </div>
        );
      case 6: // Create Package
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Creating package...</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Placeholder for output preview - to be expanded later
  const renderOutputPreview = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Upload PDF
        return file ? (
          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-red-500 mr-3"
              >
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">{fileName}</h4>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Last modified:{" "}
                  {new Date(file.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              className="w-full text-center py-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors flex items-center justify-center"
              onClick={() => {
                if (pdfPreviewUrl) {
                  setShowPdfModal(true);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              View PDF
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[150px] bg-gray-50 rounded-md">
            <p className="text-gray-400">No file uploaded</p>
          </div>
        );
      case 1: // Convert to Images
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[150px] flex items-center justify-center">
            <p className="text-gray-500">Image previews will appear here</p>
          </div>
        );
      case 2: // Section Images
        return (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-900 mb-3">Sectioned Images</h4>
            <div className="grid grid-cols-3 gap-2">
              {/* Placeholder for sectioned image previews */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="aspect-square bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() =>
                    setExpandedSection(item === expandedSection ? null : item)
                  }
                >
                  <span className="text-xs text-gray-500">Section {item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 3: // Process with GPT-4o
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[150px] flex items-center justify-center">
            <p className="text-gray-500">
              GPT processing results will appear here
            </p>
          </div>
        );
      case 4: // Generate structured JSON
        return results ? (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-900 mb-2">JSON Preview</h4>
            <div className="max-h-[200px] overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono">
              <pre>{JSON.stringify(results, null, 2).substring(0, 200)}...</pre>
            </div>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              View Full JSON
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[150px] flex items-center justify-center">
            <p className="text-gray-500">JSON structure will appear here</p>
          </div>
        );
      case 5: // Generate XML
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[150px] flex items-center justify-center">
            <p className="text-gray-500">XML preview will appear here</p>
          </div>
        );
      case 6: // Create Package
        return (
          <div className="bg-gray-50 p-4 rounded-md h-full min-h-[150px] flex items-center justify-center">
            <p className="text-gray-500">
              Package download will be available here
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // The expanded section modal
  const renderExpandedSection = () => {
    if (expandedSection === null) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Section {expandedSection} Detail
            </h3>
            <button
              onClick={() => setExpandedSection(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center">
            <p className="text-gray-500">
              Detailed view of Section {expandedSection}
            </p>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => setExpandedSection(null)}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Effect to create and clean up the PDF preview URL
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfPreviewUrl(url);

      // Clean up the URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  return (
    <div className="mt-8">
      {/* PDF Preview Modal */}
      {showPdfModal && pdfPreviewUrl && (
        <PdfPreviewModal
          pdfUrl={pdfPreviewUrl}
          fileName={fileName}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {expandedSection !== null && renderExpandedSection()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Step progression */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Process Steps
            </h3>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors ${
                    index < currentStep
                      ? "opacity-70"
                      : index === currentStep
                      ? "opacity-100"
                      : "opacity-50"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {renderStepIcon(statuses[index])}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium ${
                          index === currentStep
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        Step {index + 1}
                      </span>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          statuses[index] === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : statuses[index] === "complete"
                            ? "bg-green-100 text-green-800"
                            : statuses[index] === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statuses[index] === "processing"
                          ? "Processing"
                          : statuses[index] === "complete"
                          ? "Complete"
                          : statuses[index] === "error"
                          ? "Error"
                          : "Waiting"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Real-time process work */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Process Details
            </h3>
            <div className="mt-4">{renderProcessContent(currentStep)}</div>
          </div>
        </div>

        {/* Right Column - Output preview */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Output Preview
            </h3>
            <div className="mt-4">{renderOutputPreview(currentStep)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
