const stats = [
  { value: "10k+", label: "Active Students" },
  { value: "50+", label: "Universities Syncing" },
  { value: "1.2M", label: "Classes Tracked" },
  { value: "99.9%", label: "Accuracy Rate" },
];

export default function StatsBar() {
  return (
    <section className="bg-gray-50 border-t border-gray-200">
      {/* 👆 background + divider */}

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((item, index) => (
            <div key={index}>
              <h3 className="text-3xl font-bold text-gray-900">
                {item.value}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
