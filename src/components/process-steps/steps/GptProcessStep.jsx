import React from "react";

export default function GptProcessStep({ processingData, statuses }) {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-4">
        GPT-4o Processing
      </h4>

      {processingData?.gptData ? (
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Form Code:</span>
            <span className="font-medium">
              {processingData.gptData.formCode}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Sections:</span>
            <span className="font-medium">
              {processingData.gptData.total_sections}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Tokens:</span>
            <span className="font-medium">
              {processingData.gptData.total_tokens.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Processing Cost:</span>
            <span className="font-medium text-green-600">
              ${processingData.gptData.total_cost.toFixed(4)}
            </span>
          </div>

          {/* Processing visualization */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Processing Metrics:
            </h5>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex flex-col">
                <div className="mb-2">
                  <span className="text-xs text-gray-500">Cost per section:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(processingData.gptData.total_cost / processingData.gptData.total_sections) * 100 * 10}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0.00</span>
                    <span>${(processingData.gptData.total_cost / processingData.gptData.total_sections).toFixed(4)}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-xs text-gray-500">Tokens per section:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(processingData.gptData.total_tokens / processingData.gptData.total_sections) / 30}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>{Math.round(processingData.gptData.total_tokens / processingData.gptData.total_sections)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : statuses[3] === "processing" ? (
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
          <span className="text-gray-600 font-medium">Processing with GPT-4o...</span>
          <p className="text-xs text-gray-500 mt-2 max-w-xs text-center">
            The system is using GPT-4o to analyze form sections, identify fields, and extract structure
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <p className="text-gray-500">Waiting to begin GPT processing...</p>
        </div>
      )}
    </div>
  );
}
