export default function SectionPreview({ expandedSection, setExpandedSection }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h4 className="font-medium text-gray-900 mb-3">Sectioned Images</h4>
      <div className="grid grid-cols-3 gap-2">
        {/* Placeholder for sectioned image previews */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="aspect-square bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() =>
              setExpandedSection(item === expandedSection ? null : item)
            }
          >
            <span className="text-xs text-gray-500">Section {item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}