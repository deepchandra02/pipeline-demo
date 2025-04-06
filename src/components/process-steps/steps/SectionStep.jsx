import React from "react";

export default function SectionStep({ processingData, statuses }) {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-4">
        Image Sectioning Process
      </h4>

      {processingData?.sectionData ? (
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Job ID:</span>
            <span className="font-medium">
              {processingData.sectionData.jobId}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Sections:</span>
            <span className="font-medium">
              {processingData.sectionData.sectionCount}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Processing Time:</span>
            <span className="font-medium">
              {processingData.sectionData.sectionTime} seconds
            </span>
          </div>

          {/* Section visualization */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Section Distribution:
            </h5>
            <div className="bg-gray-100 rounded-md p-3">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({
                  length: processingData.sectionData.sectionCount || 0,
                }).map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-blue-100 rounded-md p-2 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 opacity-50"></div>
                    <div className="z-10 text-center">
                      <span className="text-xs font-medium text-blue-800">Section {idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : statuses[2] === "processing" ? (
        <div className="py-8 flex flex-col items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-yellow-500 mb-4"
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
          <span className="text-gray-600 font-medium">Processing sections...</span>
          <p className="text-xs text-gray-500 mt-2 max-w-xs text-center">
            The system is analyzing the form structure and dividing it into logical sections
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <p className="text-gray-500">Waiting to begin sectioning process...</p>
        </div>
      )}
    </div>
  );
}
