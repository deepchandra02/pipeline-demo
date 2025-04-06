export default function UploadStep({ file, fileName }) {
  return file ? (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-4">
        PDF Document Details
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">File name:</span>
          <span className="font-medium">{fileName}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">File size:</span>
          <span className="font-medium">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">File type:</span>
          <span className="font-medium">{file.type}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Last modified:</span>
          <span className="font-medium">
            {new Date(file.lastModified).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Form code:</span>
          <span className="font-medium">{fileName.split(".")[0]}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-gray-50 p-4 rounded-md h-full min-h-[200px] flex items-center justify-center">
      <p className="text-gray-500">Upload PDF file to begin processing</p>
    </div>
  );
}