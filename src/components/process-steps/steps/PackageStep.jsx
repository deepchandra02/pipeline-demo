import React from "react";

export default function PackageStep({ processingData, statuses }) {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-4">
        Package Creation
      </h4>

      {processingData?.packageData ? (
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Job ID:</span>
            <span className="font-medium">
              {processingData.packageData.jobId}
            </span>
          </div>
          
          {/* Package Status */}
          <div className="bg-green-50 rounded-md p-4 text-center">
            <div className="h-12 w-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-1">Package Created Successfully</h3>
            <p className="text-sm text-green-600">
              All form components have been packaged and are ready for download
            </p>
          </div>
          
          {/* Package Details */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Package Contents:
            </h5>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-blue-500 mt-0.5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
                    />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Form Package</span>
                    <div className="text-xs text-gray-500 mt-1">Contains all form components, assets, and configuration</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-purple-500 mt-0.5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" 
                    />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-gray-700">XML Configuration</span>
                    <div className="text-xs text-gray-500 mt-1">Form structure and field definitions</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-gray-700">JSON Metadata</span>
                    <div className="text-xs text-gray-500 mt-1">Field properties and form configuration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Download Button */}
          <div className="mt-6">
            <button className="w-full bg-[#e60000] hover:bg-[#e60000]/90 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
              Download Package
            </button>
          </div>
        </div>
      ) : statuses[6] === "processing" ? (
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
          <span className="text-gray-600 font-medium">Creating package...</span>
          <p className="text-xs text-gray-500 mt-2 max-w-xs text-center">
            Building and packaging form components for deployment
          </p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mt-4">
            <div className="w-3/4 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <p className="text-gray-500">Waiting to begin package creation...</p>
        </div>
      )}
    </div>
  );
}
