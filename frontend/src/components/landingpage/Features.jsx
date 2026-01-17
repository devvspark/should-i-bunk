const FEATURES = [
  {
    title: "Subject-Wise Analytics",
    description:
      "Deep dive into every course with detailed attendance percentages and custom university thresholds.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 17v-2a4 4 0 014-4h2" />
        <path d="M13 7h2a4 4 0 014 4v2" />
        <path d="M3 3h18v18H3z" />
      </svg>
    ),
  },
  {
    title: "Risk Assessment",
    description:
      "Real-time status badges (Safe, Risky, Unsafe) based on your curriculum and medical leave policies.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  {
    title: "Predictive Bunking",
    description:
      "Know exactly how many classes you can skip without falling below the required limit.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M13 2l-2 6h6l-8 14 2-6H5z" />
      </svg>
    ),
  },
];

export default function CoreCapabilities() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER ROW */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-16 text-center md:text-left">
          {/* LEFT */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase">
              Core Capabilities
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Everything you need to maintain <br className="hidden md:block" />
              academic eligibility.
            </h2>
          </div>

          {/* RIGHT */}
          <p className="text-gray-600 max-w-md mx-auto md:mx-0 md:mt-8">
            Stay ahead of your academic requirements with specialized tracking
            tools tailored for the modern student.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 p-8 hover:shadow-md transition bg-white"
            >
              <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
