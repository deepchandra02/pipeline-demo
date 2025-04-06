export default function ConvertPreview({
  statuses,
  processingData,
  getFileExt,
  handleImagePreview,
  handleViewAllImages
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h4 className="font-medium text-gray-900 mb-3">Converted Images</h4>

      {statuses[1] === "complete" ? (
        <div>
          {/* Grid of thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({
              length: processingData?.convertData?.pageCount || 0,
            }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gray-100 rounded-md overflow-hidden relative group cursor-pointer"
                onClick={() => handleImagePreview(idx)}
              >
                {/* Actual image thumbnail */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gray-100"
                  style={{ overflow: "hidden" }}
                >
                  <img
                    key={`thumbnail-${idx}`}
                    src={`/api/images/${
                      processingData.convertData.jobId
                    }/page_${idx + 1}${getFileExt(idx)}`}
                    alt={`Page ${idx + 1}`}
                    className="object-cover h-full w-full"
                    loading="lazy"
                    onLoad={(e) => {
                      console.log(
                        `Thumbnail for page ${
                          idx + 1
                        } loaded successfully`
                      );
                      // Make sure the image is visible and any previous error handling is cleared
                      e.target.style.display = "block";
                    }}
                    onError={(e) => {
                      console.error(
                        `Error loading thumbnail for page ${idx + 1}:`,
                        e
                      );

                      // Get or create retry count
                      if (!e.target.dataset.retryCount) {
                        e.target.dataset.retryCount = "0";
                      }
                      const retryCount = parseInt(
                        e.target.dataset.retryCount
                      );
                      e.target.dataset.retryCount = (
                        retryCount + 1
                      ).toString();

                      // Available extensions to try
                      const extensions = [".jpeg", ".jpg", ".png"];

                      // Try direct approach with each extension in turn based on retry count
                      if (retryCount < extensions.length) {
                        // Get next extension to try based on retry count
                        const nextExt = extensions[retryCount];
                        const baseUrl = `/api/images/${
                          processingData.convertData.jobId
                        }/page_${idx + 1}`;
                        const newSrc = `${baseUrl}${nextExt}`;

                        console.log(
                          `Retry ${retryCount + 1}/${
                            extensions.length
                          } for page ${idx + 1} with: ${newSrc}`
                        );
                        e.target.src = newSrc;
                      } else {
                        // If all retries failed, show fallback
                        console.log(
                          `All ${
                            extensions.length
                          } extensions failed for page ${
                            idx + 1
                          }, showing fallback UI`
                        );

                        // Create fallback element
                        const fallbackDiv = document.createElement("div");
                        fallbackDiv.className =
                          "flex flex-col items-center justify-center h-full w-full";
                        fallbackDiv.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="text-xs text-gray-500 mt-1">Image not found</span>`;

                        // Replace image with fallback
                        e.target.style.display = "none";
                        e.target.parentNode.appendChild(fallbackDiv);
                      }
                    }}
                  />
                </div>

                {/* Overlay with page number */}
                <div className="absolute inset-0 bg-black opacity-30 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                  <span className="px-2 py-1 text-white rounded font-semibold text-xs">
                    Page {idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View all images button */}
          <button
            onClick={handleViewAllImages}
            className="mt-4 w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors flex items-center justify-center"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View All Images
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-gray-400 mb-3"
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
            Converting PDF pages to images...
          </span>
          {processingData?.convertData?.pageCount && (
            <span className="text-xs text-gray-400 mt-2">
              Total: {processingData.convertData.pageCount} pages
            </span>
          )}
        </div>
      )}
    </div>
  );
}