export default function FileProcessor({
  file,
  fileName,
  error,
  processing,
  results,
  downloadUrl,
  fileInputRef, // This ref is created in the parent component and passed down
  handleFileChange,
  resetProcess,
  processFile,
  currentStep,
}) {
  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6">
      <input
        type="file"
        ref={fileInputRef} // Using the ref passed from parent
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {file && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-red-500"
                >
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {fileName}
                </h3>
                <p className="text-sm text-gray-500">
                  Form code: {fileName.split(".")[0]}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetProcess}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Change
            </button>
          </div>

          {currentStep === 1 && !processing && (
            <div className="mt-4">
              <button
                type="button"
                onClick={processFile}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#e60000] hover:bg-[#e60000]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Process PDF
              </button>
            </div>
          )}
        </div>
      )}

      {results && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Processing Results
          </h3>
          <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-auto">
            <pre className="text-xs font-mono">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="mt-8 flex justify-center">
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
            Download Package
          </a>
        </div>
      )}
    </div>
  );
}
