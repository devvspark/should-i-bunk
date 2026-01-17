const ZONES = [
  {
    title: "Safe Zone",
    range: "85% and above",
    description:
      "You are comfortably above the minimum attendance requirement. You can safely plan breaks without academic risk.",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  {
    title: "Risk Zone",
    range: "75% – 84%",
    description:
      "You are close to the minimum threshold. Skipping further classes may put your eligibility at risk.",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
  },
  {
    title: "Danger Zone",
    range: "Below 75%",
    description:
      "Your eligibility is critical. Attending all upcoming classes is strongly recommended.",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
];

export default function RiskZones() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT: Zones (Order changed on mobile for better flow) */}
        <div className="order-2 lg:order-1 space-y-4">
          {ZONES.map((zone, index) => (
            <div
              key={index}
              className={`rounded-xl border p-5 ${zone.bg} ${zone.border}`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${zone.text}`}>
                  {zone.title}
                </h3>
                <span className="text-xs font-medium text-gray-600">
                  {zone.range}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {zone.description}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: Explanation */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <p className="text-xs font-semibold tracking-widest text-teal-600 uppercase">
            Eligibility Engine
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Understand your eligibility <br className="hidden md:block" /> in a single glance.
          </h2>

          <p className="mt-4 text-gray-600 max-w-md mx-auto lg:mx-0">
            Our system evaluates subject-wise attendance, university rules,
            holidays, and credit weightage to determine your real-time risk
            category. No guesswork. No manual calculations.
          </p>

          <button className="mt-6 text-teal-600 font-semibold hover:underline">
            Learn how the engine works →
          </button>
        </div>

      </div>
    </section>
  );
}
