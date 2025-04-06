// src/components/ProcessUI.jsx
import { useState, useEffect, useRef } from "react";
import ImagePreviewModal from "./ImagePreviewModal";
import StepIcon from "./process-steps/StepIcon";
import UploadStep from "./process-steps/steps/UploadStep";
import ConvertStep from "./process-steps/steps/ConvertStep";
import SectionStep from "./process-steps/steps/SectionStep";
import GptProcessStep from "./process-steps/steps/GptProcessStep";
import JsonStep from "./process-steps/steps/JsonStep";
import XmlStep from "./process-steps/steps/XmlStep";
import PackageStep from "./process-steps/steps/PackageStep";
import UploadPreview from "./process-steps/previews/UploadPreview";
import ConvertPreview from "./process-steps/previews/ConvertPreview";
import SectionPreview from "./process-steps/previews/SectionPreview";
import GptPreview from "./process-steps/previews/GptPreview";
import JsonPreview from "./process-steps/previews/JsonPreview";
import XmlPreview from "./process-steps/previews/XmlPreview";
import PackagePreview from "./process-steps/previews/PackagePreview";
import ExpandedSectionModal from "./process-steps/ExpandedSectionModal";

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
  // const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [convertTime, setConvertTime] = useState(null);
  const startTimeRef = useRef(null);

  const getFileExt = (idx) => {
    // Default extension, the image error handling will try alternatives if this fails
    console.log(`Getting file extension for image index ${idx}`);
    return ".jpeg";
  };

  // Handle image preview
  const handleImagePreview = (index) => {
    console.log(`Previewing image ${index + 1}`);
    setCurrentImageIndex(index);
    const imageSrc = `/api/images/${processingData?.convertData?.jobId}/page_${
      index + 1
    }${getFileExt(index)}`;
    console.log(`Image preview source path: ${imageSrc}`);
    setSelectedImage({
      index,
      src: imageSrc,
      title: `Page ${index + 1}`,
      tryAlternativeExtensions: true, // Flag to tell the modal to try alternative extensions if needed
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

  // Render the appropriate process content component based on the current step
  const renderProcessContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Upload PDF
        return <UploadStep file={file} fileName={fileName} />;
      case 1: // Convert to Images
        return (
          <ConvertStep
            processingData={processingData}
            statuses={statuses}
            simulatedProgress={simulatedProgress}
            convertTime={convertTime}
          />
        );
      case 2: // Section Images
        return (
          <SectionStep processingData={processingData} statuses={statuses} />
        );
      case 3: // Process with GPT-4o
        return (
          <GptProcessStep processingData={processingData} statuses={statuses} />
        );
      case 4: // Generate structured JSON
        return (
          <JsonStep
            results={results}
            processingData={processingData}
            statuses={statuses}
          />
        );
      case 5: // Generate XML
        return <XmlStep processingData={processingData} statuses={statuses} />;
      case 6: // Create Package
        return (
          <PackageStep processingData={processingData} statuses={statuses} />
        );
      default:
        return null;
    }
  };

  // Render the appropriate preview component based on the current step
  const renderOutputPreview = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Upload PDF
        return <UploadPreview file={file} fileName={fileName} />;
      case 1: // Convert to Images
        return (
          <ConvertPreview
            statuses={statuses}
            processingData={processingData}
            getFileExt={getFileExt}
            handleImagePreview={handleImagePreview}
            handleViewAllImages={handleViewAllImages}
          />
        );
      case 2: // Section Images
        return (
          <SectionPreview
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />
        );
      case 3: // Process with GPT-4o
        return <GptPreview />;
      case 4: // Generate structured JSON
        return <JsonPreview results={results} />;
      case 5: // Generate XML
        return <XmlPreview />;
      case 6: // Create Package
        return <PackagePreview />;
      default:
        return null;
    }
  };

  // // Effect to create and clean up the PDF preview URL
  // useEffect(() => {
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setPdfPreviewUrl(url);

  //     // Clean up the URL when component unmounts or file changes
  //     return () => {
  //       URL.revokeObjectURL(url);
  //     };
  //   }
  // }, [file]);

  return (
    <div className="mt-8">
      {/* Expanded Section Modal */}
      <ExpandedSectionModal
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
      />

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          image={selectedImage.src}
          title={selectedImage.title}
          onClose={() => setSelectedImage(null)}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          hasNext={
            currentImageIndex <
            (processingData?.convertData?.pageCount || 0) - 1
          }
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
                  <StepIcon status={statuses[index]} stepNumber={index + 1} />
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
