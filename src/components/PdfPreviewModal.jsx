// src/components/PdfPreviewModal.jsx
import { useEffect, useState } from "react";

export default function PdfPreviewModal({ pdfUrl, fileName, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to simulate loading and allow the iframe to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg w-full max-w-6xl flex flex-col h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 truncate max-w-[70%]">
            {fileName}
          </h3>
          <div className="flex items-center space-x-2">
            <a
              href={pdfUrl}
              download={fileName}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
              Download
            </a>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
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
        </div>

        <div className="flex-1 bg-gray-100 overflow-hidden">
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-10 w-10 text-gray-400 mb-3"
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
                <p className="text-gray-500">Loading PDF...</p>
              </div>
            </div>
          )}

          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className={`w-full h-full ${isLoading ? "hidden" : "block"}`}
            title={`PDF Preview: ${fileName}`}
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
