export default function ConvertStep({ 
  processingData, 
  statuses, 
  simulatedProgress,
  convertTime
}) {
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
}