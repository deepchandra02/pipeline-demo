import React, { useState, useEffect } from "react";

export default function ImagePreviewModal({ image, onClose, title, onNext, onPrevious, hasNext, hasPrevious }) {
  const [imageSrc, setImageSrc] = useState(image);

  useEffect(() => {
    // Reset imageSrc when the image prop changes
    setImageSrc(image);
  }, [image]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      {/* Navigation buttons */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 p-3 rounded-full text-white z-10 transition-all shadow-lg"
          aria-label="Previous image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 p-3 rounded-full text-white z-10 transition-all shadow-lg"
          aria-label="Next image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
      <div className="bg-white rounded-lg max-w-4xl w-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {title || "Image Preview"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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

        <div className="p-4 bg-gray-100 flex-1 flex flex-col items-center justify-center">
          <img
            src={imageSrc}
            alt={title || "Preview"}
            className="max-h-[70vh] max-w-full object-contain"
            onError={(e) => {
              // Try different extensions if the current one fails
              const extensions = [".jpeg", ".jpg", ".png"];
              const currentSrc = e.target.src;
              const currentExt = currentSrc.substring(currentSrc.lastIndexOf("."));
              const baseUrl = currentSrc.substring(0, currentSrc.lastIndexOf("."));
              
              // Find the current extension index
              const currentExtIndex = extensions.indexOf(currentExt);
              
              // Try the next extension if available
              if (currentExtIndex < extensions.length - 1) {
                const nextExt = extensions[currentExtIndex + 1];
                console.log(`Trying alternative extension: ${nextExt}`);
                e.target.src = `${baseUrl}${nextExt}`;
              } else {
                // If all extensions fail, show error message
                e.target.style.display = "none";
                e.target.parentNode.innerHTML += `
                  <div class="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-gray-600">The image could not be loaded.</p>
                    <p class="text-gray-500 mt-2 text-sm">Tried all possible extensions (.jpeg, .jpg, .png) but none worked.</p>
                  </div>
                `;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
