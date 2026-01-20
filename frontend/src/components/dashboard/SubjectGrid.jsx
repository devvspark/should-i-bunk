

export default function SubjectGrid() {
  return (
    <section>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black tracking-tight text-gray-900">
          Subject Breakdown
        </h2>

        <button className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:underline">
          View All
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* SUBJECT CARD – SAFE */}
        <SubjectCard
          name="DBMS"
          teacher="Dr. Sarah Wilson"
          percent={88}
          attended="22 / 25"
          status="Safe"
          statusColor="green"
          barColor="bg-teal-600"
          note={
            <>
              Next bunk safe:{" "}
              <span className="font-bold text-teal-600">Yes</span>
            </>
          }
        />

        {/* SUBJECT CARD – WARNING */}
        <SubjectCard
          name="Operating Systems"
          teacher="Prof. Michael Chen"
          percent={76}
          attended="19 / 25"
          status="Warning"
          statusColor="yellow"
          barColor="bg-yellow-500"
          note={
            <>
              Next bunk safe:{" "}
              <span className="font-bold text-red-600">No</span>
            </>
          }
        />

        {/* SUBJECT CARD – DANGER */}
        <SubjectCard
          name="Discrete Math"
          teacher="Dr. Elena Rodriguez"
          percent={62}
          attended="16 / 25"
          status="Danger"
          statusColor="red"
          barColor="bg-red-600"
          note={
            <>
              Requirement:{" "}
              <span className="font-bold text-red-600">
                Miss 0 classes
              </span>
            </>
          }
        />

        {/* ADD SUBJECT CARD */}
        <button className="group border-2 border-dashed border-gray-200 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-teal-400 hover:bg-teal-50 transition-all min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-teal-600 group-hover:text-white transition">
            <span className="material-symbols-outlined">
              add
            </span>
          </div>

          <span className="text-sm font-bold text-gray-500 group-hover:text-teal-600">
            Add New Subject
          </span>
        </button>

      </div>
    </section>
  );
}

/* 🔹 SUBJECT CARD COMPONENT */
function SubjectCard({
  name,
  teacher,
  percent,
  attended,
  status,
  statusColor,
  barColor,
  note,
}) {
  const statusStyles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <article className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-lg font-bold text-gray-900">
            {name}
          </h4>
          <p className="text-xs text-gray-500">
            {teacher}
          </p>
        </div>

        <span
          className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-tight ${statusStyles[statusColor]}`}
        >
          {status}
        </span>
      </div>

      {/* PERCENT + COUNT */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-3xl font-black text-gray-900">
          {percent}%
        </span>
        <span className="text-sm font-medium text-gray-500">
          {attended}
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
        <div
          className={`${barColor} h-full rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* NOTE */}
      <p className="text-xs text-gray-500 leading-relaxed">
        {note}
      </p>
    </article>
  );
}

