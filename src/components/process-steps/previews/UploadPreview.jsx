import { useEffect, useState } from "react";

export default function UploadPreview({ file, fileName }) {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

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
}