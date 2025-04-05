// src/components/PdfPreviewAlternative.jsx
import { useEffect, useState } from "react";

export default function PdfPreviewAlternative({ file, fileName, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [pdfPages, setPdfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // When a blob URL doesn't work, we can create a placeholder preview
    // In a real implementation, we would use PDF.js to render the PDF
    setIsLoading(false);

    // For demo purposes, create placeholder pages
    const pages = Array(3)
      .fill()
      .map((_, i) => i + 1);
    setPdfPages(pages);
  }, [file]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg w-full max-w-6xl flex flex-col h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 truncate max-w-[70%]">
            {fileName}
          </h3>
          <div className="flex items-center space-x-2">
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

        <div className="flex-1 bg-gray-100 overflow-auto p-6">
          {isLoading ? (
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
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">
                    Page {currentPage} of {pdfPages.length}
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${
                        currentPage === 1
                          ? "text-gray-300"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, pdfPages.length)
                        )
                      }
                      disabled={currentPage === pdfPages.length}
                      className={`p-2 rounded-full ${
                        currentPage === pdfPages.length
                          ? "text-gray-300"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* PDF page content would normally come from PDF.js */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg min-h-[60vh] flex flex-col items-center justify-center p-4">
                  <div className="text-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-20 h-20 text-red-500 mx-auto mb-2"
                    >
                      <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                    </svg>
                    <h5 className="text-lg font-medium">{fileName}</h5>
                    <p className="text-gray-500">Page {currentPage}</p>
                  </div>

                  <div className="text-center text-gray-500">
                    <p>
                      Note: Due to browser security restrictions, PDF rendering
                      requires integration with a library like PDF.js.
                    </p>
                    <p className="mt-2">
                      For now, this is a placeholder preview of your PDF.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-md bg-white"
                  >
                    {pdfPages.map((page) => (
                      <option key={page} value={page}>
                        Page {page}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  To view the full PDF, you can download it and open it in your
                  preferred PDF viewer.
                </p>
                <button
                  onClick={() => {
                    // Create a temporary link to download the file
                    const url = URL.createObjectURL(file);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
