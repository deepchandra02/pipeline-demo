// src/components/ProcessFlow.jsx
export default function ProcessFlow({ steps, currentStep, statuses }) {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <nav aria-label="Progress">
          <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {steps.map((step, index) => (
              <li key={step} className="md:flex-1">
                <div
                  className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                    currentStep > index
                      ? "border-[#e60000] md:border-[#e60000]"
                      : currentStep === index
                      ? "border-[#e60000] md:border-[#e60000]"
                      : "border-gray-200 md:border-gray-200"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      currentStep > index
                        ? "text-[#e60000]"
                        : currentStep === index
                        ? "text-[#e60000]"
                        : "text-gray-500"
                    }`}
                  >
                    Step {index + 1}
                  </span>
                  <span className="text-sm font-medium">{step}</span>

                  {/* Status indicator */}
                  <div className="mt-1">
                    {statuses[index] === "processing" && (
                      <span className="inline-flex items-center text-xs text-yellow-500">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3 w-3"
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
                        Processing
                      </span>
                    )}
                    {statuses[index] === "complete" && (
                      <span className="inline-flex items-center text-xs text-green-500">
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Complete
                      </span>
                    )}
                    {statuses[index] === "error" && (
                      <span className="inline-flex items-center text-xs text-red-500">
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Error
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
