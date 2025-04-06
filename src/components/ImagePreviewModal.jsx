import React, { useState, useEffect } from "react";

export default function ImagePreviewModal({ image, onClose, title }) {
  const [imageSrc, setImageSrc] = useState(image);

  // Function to try different image extensions if the original doesn't load
  const tryAlternativeExtensions = (originalSrc) => {
    // List of extensions to try
    const extensions = [".png", ".jpg", ".jpeg"];

    // Get the base URL without extension
    const baseSrc = originalSrc.split(".").slice(0, -1).join(".");

    // Try each extension
    let loadAttempt = 0;
    const tryNextExtension = () => {
      if (loadAttempt >= extensions.length) return; // All attempts failed

      const newSrc = `${baseSrc}${extensions[loadAttempt]}`;
      const img = new Image();
      img.onload = () => {
        console.log(
          `Successfully loaded image with ${extensions[loadAttempt]}`
        );
        setImageSrc(newSrc);
      };
      img.onerror = () => {
        loadAttempt++;
        tryNextExtension();
      };
      img.src = newSrc;
    };

    tryNextExtension();
  };

  useEffect(() => {
    // Check if image exists, if not try alternative extensions
    const img = new Image();
    img.onerror = () => {
      tryAlternativeExtensions(image);
    };
    img.src = image;

    return () => {
      img.onerror = null;
    };
  }, [image]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
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
              e.target.style.display = "none";
              // Show error message when image fails to load
              e.target.parentNode.innerHTML += `
                <div class="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p class="text-gray-600">The image could not be loaded.</p>
                  <p class="text-gray-500 mt-2 text-sm">Check if the image path is correct and the server is properly configured.</p>
                </div>
              `;
            }}
          />
        </div>
      </div>
    </div>
  );
}
