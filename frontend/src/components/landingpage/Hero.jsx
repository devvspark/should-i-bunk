export default function Hero() {
  return (
    <section className="bg-white py-12 md:py-20 lg:min-h-[calc(100vh-80px)] flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT CONTENT */}
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-semibold mb-6 md:mb-8">
            ⚡ Attendance Decision Engine
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.2] lg:leading-[1.1] text-gray-900">
            Know your attendance{" "}
            <span className="text-teal-600">risk</span>{" "}
            before skipping.
          </h1>

          {/* Description */}
          <p className="mt-6 md:mt-8 text-base md:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
            A smart attendance decision system designed for college students.
            Track subject-wise progress, analyze academic risks, and make
            informed choices with confidence.
          </p>

          {/* Buttons */}
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-5">
            <button className="px-8 py-4 bg-teal-600 text-white rounded-xl text-lg font-semibold hover:bg-teal-700 transition w-full sm:w-auto">
              Get Started for Free
            </button>

            <button className="px-8 py-4 border border-gray-300 rounded-xl text-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 w-full sm:w-auto">
              ▶ View Demo
            </button>
          </div>

          {/* Trust */}
          <p className="mt-8 text-base text-gray-500">
            Trusted by <span className="font-semibold">10k+</span> students daily
          </p>
        </div>

        {/* RIGHT DASHBOARD PREVIEW */}
        <div className="relative flex justify-center mt-12 lg:mt-0 overflow-hidden sm:overflow-visible px-2">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-xl p-6 md:p-8 w-full max-w-lg lg:scale-[1.05]">
            
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-lg text-gray-900">
                Dashboard Preview
              </h4>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                MODERATE RISK
              </span>
            </div>

            {/* Subject 1 */} 
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Advanced Calculus</span>
                <span className="font-semibold">76%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full">
                <div className="h-2.5 bg-orange-400 rounded-full w-[76%]" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Threshold: 75% · Can skip: 0 classes
              </p>
            </div>

            {/* Subject 2 */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Data Structures</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full">
                <div className="h-2.5 bg-green-500 rounded-full w-[92%]" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Threshold: 75% · Can skip: 4 classes
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-500">Overall</p>
                <p className="text-2xl font-bold text-gray-900">84%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Safety Score</p>
                <p className="text-base font-semibold text-green-600">High</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
