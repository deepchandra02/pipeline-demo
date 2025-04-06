export default function ExpandedSectionModal({ expandedSection, setExpandedSection }) {
  if (expandedSection === null) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Section {expandedSection} Detail
          </h3>
          <button
            onClick={() => setExpandedSection(null)}
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
        <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center">
          <p className="text-gray-500">
            Detailed view of Section {expandedSection}
          </p>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={() => setExpandedSection(null)}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}