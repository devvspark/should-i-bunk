




export default function OverviewCards() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ================= LEFT BIG CARD ================= */}
      <article className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-10">

        {/* 🔵 Circular Progress */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
              className="stroke-gray-200"
              fill="transparent"
            />
            {/* Progress Circle (82%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="45"
              strokeLinecap="round"
              className="stroke-teal-600"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">
              82%
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">
              Overall
            </span>
          </div>
        </div>

        {/* 🔵 Info Section */}
        <div className="flex-1 text-center md:text-left">

          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Status: Safe Zone
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Steady Progress
          </h3>

          <p className="text-gray-500 mb-6 max-w-sm">
            You are currently <b>7%</b> above the minimum required attendance.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Attended
              </p>
              <p className="text-xl font-black text-teal-600">
                124 <span className="text-xs font-normal">hrs</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Missed
              </p>
              <p className="text-xl font-black text-red-600">
                12 <span className="text-xs font-normal">hrs</span>
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* ================= RIGHT GOAL CARD ================= */}
      <article className="bg-teal-600 rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between">

        <div>
          <p className="text-sm uppercase tracking-widest opacity-80 mb-1">
            Today’s Goal
          </p>
          <h3 className="text-2xl font-bold leading-tight">
            Don’t miss OS Lab today
          </h3>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-white/70">
              schedule
            </span>
            14:00 – 16:00 (Room 402)
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-white/70">
              warning
            </span>
            Critical: Risk of drop
          </div>
        </div>

        <button className="mt-6 w-full bg-white text-teal-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition">
          Mark as Present
        </button>
      </article>
    </section>
  );
}
