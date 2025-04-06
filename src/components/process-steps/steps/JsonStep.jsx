import React, { useState } from "react";

export default function JsonStep({ results, processingData, statuses }) {
  const [expandedField, setExpandedField] = useState(null);

  const toggleField = (field) => {
    setExpandedField(expandedField === field ? null : field);
  };

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-4">
        JSON Structure Generation
      </h4>

      {results ? (
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Form Code:</span>
            <span className="font-medium">{results.form_code}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Form Title:</span>
            <span className="font-medium">{results.form_title}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Last Modified:</span>
            <span className="font-medium">
              {new Date(results.last_modified_date).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Sections:</span>
            <span className="font-medium">{results.sections?.length || 0}</span>
          </div>
          
          {/* JSON Structure Explorer */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Form Structure:
            </h5>
            
            <div className="bg-gray-50 rounded-md p-3 max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                {/* Form Title */}
                <div 
                  className="bg-blue-50 rounded-md p-2 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => toggleField('form_title')}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800">Form Title</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-blue-600 transform transition-transform ${expandedField === 'form_title' ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {expandedField === 'form_title' && (
                    <div className="mt-2 text-sm text-gray-700">
                      <pre className="bg-white p-2 rounded overflow-x-auto text-xs">
                        {results.form_title}
                      </pre>
                    </div>
                  )}
                </div>
                
                {/* Sections */}
                {results.sections?.map((section, idx) => (
                  <div 
                    key={idx}
                    className="bg-blue-50 rounded-md p-2 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => toggleField(`section_${idx}`)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-800">
                        Section {idx + 1}: {section.title || 'Untitled Section'}
                      </span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 text-blue-600 transform transition-transform ${expandedField === `section_${idx}` ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {expandedField === `section_${idx}` && (
                      <div className="mt-2 text-sm text-gray-700">
                        <div className="mb-1 flex">
                          <span className="text-gray-500 w-24">Fields:</span>
                          <span className="font-medium">{section.fields?.length || 0}</span>
                        </div>
                        <div className="mb-1 flex">
                          <span className="text-gray-500 w-24">Section ID:</span>
                          <span className="font-medium">{section.section_id || 'N/A'}</span>
                        </div>
                        <div className="mb-1 flex">
                          <span className="text-gray-500 w-24">Instructions:</span>
                          <span className="font-medium">{section.instructions || 'None'}</span>
                        </div>
                        
                        {section.fields && section.fields.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-medium text-gray-600 mb-1">Fields:</div>
                            <div className="bg-white p-2 rounded overflow-x-auto max-h-[150px] overflow-y-auto">
                              <table className="min-w-full text-xs">
                                <thead>
                                  <tr>
                                    <th className="text-left py-1 px-2 bg-gray-100">Field</th>
                                    <th className="text-left py-1 px-2 bg-gray-100">Type</th>
                                    <th className="text-left py-1 px-2 bg-gray-100">Required</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {section.fields.map((field, fieldIdx) => (
                                    <tr key={fieldIdx} className="border-b border-gray-100">
                                      <td className="py-1 px-2">{field.label || field.name || 'Unnamed'}</td>
                                      <td className="py-1 px-2">{field.type || 'text'}</td>
                                      <td className="py-1 px-2">{field.required ? 'Yes' : 'No'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : statuses[4] === "processing" ? (
        <div className="py-8 flex flex-col items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-yellow-500 mb-4"
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
          <span className="text-gray-600 font-medium">Generating JSON...</span>
          <p className="text-xs text-gray-500 mt-2 max-w-xs text-center">
            Compiling GPT-4o output into structured JSON format
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <p className="text-gray-500">Waiting to begin JSON structuring...</p>
        </div>
      )}
    </div>
  );
}
