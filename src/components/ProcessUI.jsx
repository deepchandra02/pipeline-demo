// src/components/ProcessUI.jsx
import { useState, useEffect, useRef } from "react";
import ImagePreviewModal from "./ImagePreviewModal";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [convertTime, setConvertTime] = useState(null);
  const startTimeRef = useRef(null);

  const getFileExt = (idx) => {
    // Default extension, the image error handling will try alternatives if this fails
    return ".jpeg";
  };

  // Handle image preview
  const handleImagePreview = (index) => {
    setCurrentImageIndex(index);
    setSelectedImage({
      index,
      src: `/api/images/${processingData?.convertData?.jobId}/page_${index + 1}${getFileExt(index)}`,
      title: `Page ${index + 1}`,
      tryAlternativeExtensions: true // Flag to tell the modal to try alternative extensions if needed
    });
  };

  // Navigation functions for image preview
  const handleNextImage = () => {
    if (currentImageIndex < (processingData?.convertData?.pageCount || 0) - 1) {
      handleImagePreview(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      handleImagePreview(currentImageIndex - 1);
    }
  };

  // Handle "View All Images" button click
  const handleViewAllImages = () => {
    if (processingData?.convertData?.pageCount > 0) {
      handleImagePreview(0); // Start with the first image
    }
  };

  // Handle real or simulated page conversion progress
  useEffect(() => {
    if (
      statuses[1] === "processing" &&
      processingData?.convertData?.pageCount
    ) {
      startTimeRef.current = Date.now();

      const pageCount = processingData.convertData.pageCount;
      let currentPage = 0;

      // If we have actual conversion time, use it to calculate the simulation speed
      let intervalTime = 500; // default 500ms per page

      if (processingData.convertData.conversionTime) {
        // If we know total conversion time, distribute it evenly across pages
        const conversionTimeMs =
          parseFloat(processingData.convertData.conversionTime) * 1000;
        intervalTime = conversionTimeMs / pageCount;
        // Make sure it's not too fast for UI
        intervalTime = Math.max(100, intervalTime);
      }

      const interval = setInterval(() => {
        if (currentPage < pageCount) {
          currentPage++;
          setSimulatedProgress(currentPage);

          if (currentPage === pageCount) {
            clearInterval(interval);
            // Use the actual conversion time if available
            if (processingData.convertData.conversionTime) {
              setConvertTime(
                `${Number(processingData.convertData.conversionTime).toFixed(
                  3
                )} seconds`
              );
            } else {
              // Fallback to calculated time
              const endTime = Date.now();
              const totalTime = (
                (endTime - startTimeRef.current) /
                1000
              ).toFixed(3);
              setConvertTime(`${totalTime} seconds`);
            }
          }
        } else {
          clearInterval(interval);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }

    // Reset when changing steps or status
    return () => {
      setSimulatedProgress(0);
    };
  }, [statuses[1], processingData?.convertData?.pageCount]);

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
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">
              PDF to Images Conversion
            </h4>

            {processingData?.convertData ? (
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Job ID:</span>
                  <span className="font-medium">
                    {processingData.convertData.jobId}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Pages:</span>
                  <span className="font-medium">
                    {processingData.convertData.pageCount}
                  </span>
                </div>

                {/* Simulated page conversion progress */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Conversion Progress:
                  </h5>

                  <div className="space-y-2">
                    {Array.from({
                      length: processingData.convertData.pageCount,
                    }).map((_, idx) => {
                      // Calculate if this page is "converted" based on how long the step has been processing
                      const isConverted =
                        statuses[1] === "complete" || idx < simulatedProgress;

                      return (
                        <div
                          key={idx}
                          className="flex items-center py-2 px-3 bg-gray-50 rounded-md"
                        >
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 ${
                              isConverted ? "bg-green-100" : "bg-yellow-100"
                            }`}
                          >
                            {isConverted ? (
                              <svg
                                className="h-3 w-3 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="animate-spin h-3 w-3 text-yellow-500"
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
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-700">
                                Page {idx + 1} of{" "}
                                {processingData.convertData.pageCount}
                              </span>
                              {isConverted &&
                                processingData?.convertData?.conversionTime && (
                                  <span className="text-xs text-gray-500">
                                    {(
                                      (processingData.convertData
                                        .conversionTime /
                                        processingData.convertData.pageCount) *
                                      (idx + 1)
                                    ).toFixed(3)}
                                    s
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conversion time */}
                {(statuses[1] === "complete" ||
                  processingData?.convertData?.conversionTime) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Total Conversion Time:
                      </span>
                      <span className="font-medium">
                        {convertTime ||
                          `${Number(
                            processingData?.convertData?.conversionTime || 0
                          ).toFixed(3)} seconds`}
                      </span>
                    </div>

                    {/* Performance metrics - showing when available */}
                    {processingData?.convertData?.conversionTime && (
                      <div className="mt-2 text-xs text-gray-500">
                        <div className="flex justify-between items-center mt-1">
                          <span>Average time per page:</span>
                          <span>
                            {(
                              processingData.convertData.conversionTime /
                              processingData.convertData.pageCount
                            ).toFixed(3)}{" "}
                            seconds
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 flex items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-gray-400 mr-3"
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
                <span className="text-gray-500">
                  Starting conversion process...
                </span>
              </div>
            )}
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
                  // Create an anchor element and trigger the download
                  const a = document.createElement("a");
                  a.href = pdfPreviewUrl;
                  a.download = fileName;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download PDF
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[150px] bg-gray-50 rounded-md">
            <p className="text-gray-400">No file uploaded</p>
          </div>
        );
      case 1: // Convert to Images
        return (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-900 mb-3">Converted Images</h4>

            {statuses[1] === "complete" ? (
              <div>
                {/* Grid of thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({
                    length: processingData?.convertData?.pageCount || 0,
                  }).map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-100 rounded-md overflow-hidden relative group cursor-pointer"
                      onClick={() => handleImagePreview(idx)}
                    >
                      {/* Actual image thumbnail - using the same logic as handleImagePreview */}
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-gray-100"
                        style={{ overflow: "hidden" }}
                      >
                        <img
                          src={`/api/images/${processingData.convertData.jobId}/page_${idx + 1}${getFileExt(idx)}`}
                          alt={`Page ${idx + 1}`}
                          className="object-cover h-full w-full"
                          loading="lazy"
                          onError={(e) => {
                            // Try different extensions if the default one fails
                            const extensions = [".jpeg", ".jpg", ".png"];
                            const currentSrc = e.target.src;
                            const currentExt = currentSrc.substring(currentSrc.lastIndexOf("."));
                            const baseUrl = currentSrc.substring(0, currentSrc.lastIndexOf("."));
                            
                            // Find the current extension index
                            const currentExtIndex = extensions.indexOf(currentExt);
                            
                            // Try the next extension if available
                            if (currentExtIndex < extensions.length - 1) {
                              const nextExt = extensions[currentExtIndex + 1];
                              e.target.src = `${baseUrl}${nextExt}`;
                            } else {
                              // If all extensions fail, show fallback
                              e.target.style.display = "none";
                              e.target.parentNode.innerHTML = `<div class="flex flex-col items-center justify-center h-full w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-xs text-gray-500 mt-1">Image not found</span>
                              </div>`;
                            }
                          }}
                        />
                      </div>

                      {/* Overlay with page number */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                        <span className="px-2 py-1 bg-black bg-opacity-50 text-white rounded text-xs">
                          Page {idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View all images button */}
                <button 
                  onClick={handleViewAllImages}
                  className="mt-4 w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View All Images
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg
                  className="animate-spin h-8 w-8 text-gray-400 mb-3"
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
                <span className="text-gray-500">
                  Converting PDF pages to images...
                </span>
                {processingData?.convertData?.pageCount && (
                  <span className="text-xs text-gray-400 mt-2">
                    Total: {processingData.convertData.pageCount} pages
                  </span>
                )}
              </div>
            )}
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
      {expandedSection !== null && renderExpandedSection()}

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          image={selectedImage.src}
          title={selectedImage.title}
          onClose={() => setSelectedImage(null)}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          hasNext={currentImageIndex < (processingData?.convertData?.pageCount || 0) - 1}
          hasPrevious={currentImageIndex > 0}
        />
      )}

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
