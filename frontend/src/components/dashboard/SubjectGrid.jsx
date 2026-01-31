




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function SubjectGrid() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/subjects");
      setSubjects(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const calculateStatus = (subject) => {
    if (subject.totalClasses === 0) {
      return { status: "No Data", color: "gray", barColor: "bg-gray-400" };
    }
    
    const percentage = (subject.attendedClasses / subject.totalClasses) * 100;
    
    if (percentage >= subject.minPercentage + 10) {
      return { status: "Safe", color: "green", barColor: "bg-teal-600" };
    } else if (percentage >= subject.minPercentage) {
      return { status: "Warning", color: "yellow", barColor: "bg-yellow-500" };
    } else {
      return { status: "Danger", color: "red", barColor: "bg-red-600" };
    }
  };

  const calculateSafeBunks = (subject) => {
    if (subject.totalClasses === 0) return 0;
    
    let tempTotal = subject.totalClasses;
    let safeBunks = 0;
    
    while (
      ((subject.attendedClasses / (tempTotal + 1)) * 100) >= subject.minPercentage
    ) {
      tempTotal++;
      safeBunks++;
    }
    
    return safeBunks;
  };

  const calculateClassesNeeded = (subject) => {
    if (subject.totalClasses === 0) return 0;
    
    let target = 0;
    while (
      ((subject.attendedClasses + target) / (subject.totalClasses + target)) * 100 < subject.minPercentage
    ) {
      target++;
    }
    
    return target;
  };

  const getSafetyNote = (subject) => {
    if (subject.totalClasses === 0) {
      return "No attendance data available";
    }
    
    const percentage = (subject.attendedClasses / subject.totalClasses) * 100;
    const isSafe = percentage >= subject.minPercentage;
    
    if (isSafe) {
      const safeBunks = calculateSafeBunks(subject);
      return safeBunks > 0 
        ? `Can bunk next ${safeBunks} class${safeBunks !== 1 ? 'es' : ''} safely`
        : "Cannot bunk next class";
    } else {
      const classesNeeded = calculateClassesNeeded(subject);
      return `Need ${classesNeeded} more class${classesNeeded !== 1 ? 'es' : ''} to be safe`;
    }
  };

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight text-gray-900">
            Subject Breakdown
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error && subjects.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight text-gray-900">
            Subject Breakdown
          </h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-red-200">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchSubjects}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const displayedSubjects = subjects.slice(0, 3);

  return (
    <section>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black tracking-tight text-gray-900">
          Subject Breakdown
        </h2>

        {subjects.length > 3 && (
          <button 
            onClick={() => navigate("/subjects")}
            className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:underline"
          >
            View All ({subjects.length})
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* DYNAMIC SUBJECT CARDS */}
        {displayedSubjects.map((subject) => {
          const { status, color, barColor } = calculateStatus(subject);
          const percentage = subject.totalClasses > 0 
            ? ((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1)
            : 0;
          const attendedText = `${subject.attendedClasses} / ${subject.totalClasses}`;
          const note = getSafetyNote(subject);
          
          return (
            <SubjectCard
              key={subject._id}
              id={subject._id}
              name={subject.name}
              percentage={percentage}
              attended={attendedText}
              minPercentage={subject.minPercentage}
              status={status}
              statusColor={color}
              barColor={barColor}
              note={note}
              totalClasses={subject.totalClasses}
              onEdit={() => navigate(`/subjects/${subject._id}`)}
            />
          );
        })}

        {/* SHOW EMPTY STATE IF NO SUBJECTS */}
        {subjects.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-3xl">
                  school
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Subjects Yet</h3>
              <p className="text-gray-500 mb-4">Add your first subject to start tracking attendance</p>
              <button
                onClick={() => navigate("/subjects/add")}
                className="px-5 h-10 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
              >
                + Add Your First Subject
              </button>
            </div>
          </div>
        )}

        {/* ADD SUBJECT CARD (Show if we have less than 3 subjects) */}
        {subjects.length > 0 && subjects.length < 3 && (
          <button
            onClick={() => navigate("/subjects/add")}
            className="group border-2 border-dashed border-gray-200 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-teal-400 hover:bg-teal-50 transition-all min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-teal-600 group-hover:text-white transition">
              <span className="material-symbols-outlined">
                add
              </span>
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-teal-600">
              Add Another Subject
            </span>
          </button>
        )}

        {/* ALWAYS SHOW ADD CARD IF WE HAVE 3 OR MORE SUBJECTS */}
        {subjects.length >= 3 && (
          <button
            onClick={() => navigate("/subjects/add")}
            className="group border-2 border-dashed border-gray-200 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-teal-400 hover:bg-teal-50 transition-all min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-teal-600 group-hover:text-white transition">
              <span className="material-symbols-outlined">
                add
              </span>
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-teal-600">
              Add New Subject
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

/* 🔹 SUBJECT CARD COMPONENT */
function SubjectCard({
  id,
  name,
  percentage,
  attended,
  minPercentage,
  status,
  statusColor,
  barColor,
  note,
  totalClasses,
  onEdit,
}) {
  const statusStyles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <article 
      onClick={onEdit}
      className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer hover:border-teal-200"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-gray-900 truncate" title={name}>
            {name}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Min Required: <span className="font-semibold">{minPercentage}%</span>
          </p>
        </div>

        <span
          className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-tight whitespace-nowrap ml-2 ${statusStyles[statusColor]}`}
        >
          {status}
        </span>
      </div>

      {/* PERCENTAGE + ATTENDANCE COUNT */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-3xl font-black text-gray-900">
          {totalClasses > 0 ? `${percentage}%` : "N/A"}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {attended}
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
        {totalClasses > 0 ? (
          <div
            className={`${barColor} h-full rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </div>

      {/* SAFETY NOTE */}
      <p className="text-xs text-gray-600 leading-relaxed min-h-[20px]">
        {note}
      </p>

      {/* QUICK ACTION */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="text-teal-600 text-xs font-semibold hover:text-teal-700">
          Edit Attendance →
        </button>
      </div>
    </article>
  );
}