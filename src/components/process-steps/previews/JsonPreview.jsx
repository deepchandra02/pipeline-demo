export default function JsonPreview({ results }) {
  return results ? (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h4 className="font-medium text-gray-900 mb-2">JSON Preview</h4>
      <div className="max-h-[200px] overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono">
        <pre>{JSON.stringify(results, null, 2).substring(0, 200)}...</pre>
      </div>
      <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
        View Full JSON
      </button>
    </div>
  ) : (
    <div className="bg-gray-50 p-4 rounded-md h-full min-h-[150px] flex items-center justify-center">
      <p className="text-gray-500">JSON structure will appear here</p>
    </div>
  );
}