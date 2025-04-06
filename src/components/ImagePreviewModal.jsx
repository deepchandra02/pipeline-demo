// src/components/ImagePreviewModal.jsx
import React from "react";

export default function ImagePreviewModal({ image, onClose, title }) {
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

        <div className="p-4 bg-gray-100 flex-1 flex items-center justify-center">
          <img
            src={image}
            alt={title || "Preview"}
            className="max-h-[70vh] max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
