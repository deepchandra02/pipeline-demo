export default function Hero() {
  return (
    <div className="relative px-8">
      <div className="mx-auto max-w-2xl py-32 ">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-[#5a5d5c] ring-1 ring-[#5a5d5c]/10 hover:ring-[#5a5d5c]/20">
            Demo{" "}
            <a href="#" className="font-semibold text-[#e60000]">
              <span aria-hidden="true" className="absolute inset-0" />0
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-black sm:text-7xl">
            Forms Conversion Service
          </h1>
          <p className="mt-16 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Upload a PDF to get started
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-[#e60000] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#e60000]/90 flex items-center gap-x-2"
            >
              <span>Upload</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
