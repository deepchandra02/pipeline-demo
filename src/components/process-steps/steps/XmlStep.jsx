import React from "react";

export default function XmlStep({ processingData, statuses }) {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-4">
        XML Generation
      </h4>

      {processingData?.xmlData ? (
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Job ID:</span>
            <span className="font-medium">
              {processingData.xmlData.jobId}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">XML File Path:</span>
            <span className="font-medium text-xs truncate max-w-[250px]" title={processingData.xmlData.xmlFilePath}>
              {processingData.xmlData.xmlFilePath}
            </span>
          </div>
          
          {/* XML Preview */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              XML Structure Preview:
            </h5>
            <div className="bg-gray-50 rounded-md p-3">
              <div className="bg-gray-900 text-gray-100 p-3 rounded-md max-h-[200px] overflow-y-auto font-mono text-xs">
                <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" 
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured">
    <form
        jcr:primaryType="nt:unstructured"
        jcr:title="${processingData.jsonData?.json?.form_title || 'Form Title'}"
        sling:resourceType="forms/af/components/form">
        
        <!-- Form sections and fields -->
        <sections jcr:primaryType="nt:unstructured">
            <!-- Section details would appear here -->
            <!-- ${processingData.jsonData?.json?.sections?.length || 0} sections detected -->
        </sections>
        
        <!-- Metadata and properties -->
        <metadata
            jcr:primaryType="nt:unstructured"
            formId="${processingData.jsonData?.json?.form_code || 'form-id'}"
            lastModifiedDate="${processingData.jsonData?.json?.last_modified_date || new Date().toISOString()}"
            lastModifiedBy="${processingData.jsonData?.json?.last_modified_by || 'system'}">
        </metadata>
    </form>
</jcr:root>`}</pre>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-xs text-gray-500">Note: This is a simplified preview of the actual XML</span>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  View Full XML
                </button>
              </div>
            </div>
          </div>
          
          {/* XML Generation Metrics */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              XML Generation Metrics:
            </h5>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 p-3 rounded-md">
                <span className="text-xs text-green-600 block">File Size</span>
                <span className="text-lg font-medium text-green-800">~12 KB</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <span className="text-xs text-blue-600 block">Elements</span>
                <span className="text-lg font-medium text-blue-800">
                  {((processingData.jsonData?.json?.sections?.length || 0) * 5) + 10}
                </span>
              </div>
              <div className="bg-purple-50 p-3 rounded-md">
                <span className="text-xs text-purple-600 block">Generation Time</span>
                <span className="text-lg font-medium text-purple-800">0.3s</span>
              </div>
            </div>
          </div>
        </div>
      ) : statuses[5] === "processing" ? (
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
          <span className="text-gray-600 font-medium">Generating XML...</span>
          <p className="text-xs text-gray-500 mt-2 max-w-xs text-center">
            Converting structured JSON into XML format suitable for form processing
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <p className="text-gray-500">Waiting to begin XML generation...</p>
        </div>
      )}
    </div>
  );
}
