import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import TopHeader from "../components/dashboard/TopHeader";
import axiosInstance from "../utils/axiosInstance";

const statusStyles = {
  SAFE: "bg-green-100 text-green-700",
  WARNING: "bg-yellow-100 text-yellow-700",
  DANGER: "bg-red-100 text-red-700",
};

const decisionMeta = (projected, min) => {
  if (projected < min) return { label: "CRITICAL", text: "NO, DO NOT BUNK" };
  if (projected - min < 2) return { label: "WARNING", text: "PROCEED WITH CAUTION" };
  return { label: "SAFE", text: "YES, YOU CAN BUNK" };
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [scenario, setScenario] = useState("BUNK");
  const [count, setCount] = useState(1);
  const [decisionShown, setDecisionShown] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/analytics");
        setAnalytics(res.data);
        const firstId = res.data?.subjects?.[0]?.id || "";
        setSelectedSubjectId(firstId);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const selectedSubject = useMemo(
    () =>
      analytics?.subjects?.find((subject) => String(subject.id) === String(selectedSubjectId)) ||
      null,
    [analytics, selectedSubjectId]
  );

  const simulation = useMemo(() => {
    if (!selectedSubject) return null;

    const c = Math.max(1, Number(count) || 1);
    const total = selectedSubject.totalClasses;
    const attended = selectedSubject.attendedClasses;
    const min = selectedSubject.minPercentage;
    let newTotal = total;
    let newAttended = attended;

    if (scenario === "BUNK" || scenario === "MISS") {
      newTotal = total + c;
    } else if (scenario === "ATTEND") {
      newTotal = total + c;
      newAttended = attended + c;
    }

    const current = total > 0 ? (attended / total) * 100 : 0;
    const projected = newTotal > 0 ? (newAttended / newTotal) * 100 : 0;
    const impact = projected - current;
    const verdict = decisionMeta(projected, min);

    const impactTable = (analytics?.subjects || []).map((subject) => {
      const base =
        subject.totalClasses > 0
          ? (subject.attendedClasses / subject.totalClasses) * 100
          : 0;

      if (String(subject.id) !== String(selectedSubject.id)) {
        return {
          id: subject.id,
          name: subject.name,
          before: Number(base.toFixed(1)),
          after: Number(base.toFixed(1)),
          changed: false,
        };
      }

      return {
        id: subject.id,
        name: subject.name,
        before: Number(current.toFixed(1)),
        after: Number(projected.toFixed(1)),
        changed: true,
      };
    });

    return {
      current: Number(current.toFixed(1)),
      projected: Number(projected.toFixed(1)),
      impact: Number(impact.toFixed(1)),
      verdict,
      impactTable,
    };
  }, [analytics, selectedSubject, scenario, count]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#f7fafa]">
        <div className="fixed left-0 top-0 h-screen z-20">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col ml-0 lg:ml-64 pt-16 lg:pt-20 p-6 items-center justify-center">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f7fafa]">
      <div className="fixed left-0 top-0 h-screen z-20">
        <Sidebar />
      </div>
      <div className="fixed top-0 left-0 right-0 lg:left-64 z-10">
        <TopHeader />
      </div>

      <main className="flex-1 flex flex-col ml-0 lg:ml-64 pt-16 lg:pt-20 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Overall Attendance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Overall %</p>
              <p className="text-3xl font-black text-gray-900">{analytics?.overall?.percentage || 0}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                  statusStyles[analytics?.overall?.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {analytics?.overall?.status || "NO DATA"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Attendance</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics?.overall?.totalAttended || 0} / {analytics?.overall?.totalClasses || 0}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Risk Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(analytics?.subjects || []).map((subject) => (
              <article key={subject.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900">{subject.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black ${statusStyles[subject.status]}`}>
                    {subject.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-900 mt-3">{subject.percentage}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  Classes needed to be safe: <span className="font-semibold">{subject.classesToTarget}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Predictive Simulator</h2>

            <div>
              <label className="block text-xs text-gray-500 uppercase mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
              >
                {(analytics?.subjects || []).map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 uppercase mb-1">Scenario</label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                >
                  <option value="BUNK">Bunk</option>
                  <option value="ATTEND">Attend</option>
                  <option value="MISS">Miss</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase mb-1">Classes</label>
                <input
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {simulation && (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="text-xl font-bold">{simulation.current}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Projected</p>
                  <p className="text-xl font-bold">{simulation.projected}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Impact</p>
                  <p className={`text-xl font-bold ${simulation.impact < 0 ? "text-red-600" : "text-green-600"}`}>
                    {simulation.impact > 0 ? "+" : ""}
                    {simulation.impact}%
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setDecisionShown(true)}
              className="w-full h-11 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Should I Bunk?
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Decision Verdict</h2>
            {!decisionShown || !simulation ? (
              <p className="text-sm text-gray-500">
                Run simulation and click &quot;Should I Bunk?&quot; to view verdict.
              </p>
            ) : (
              <div className="space-y-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    simulation.verdict.label === "SAFE"
                      ? "bg-green-100 text-green-700"
                      : simulation.verdict.label === "WARNING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {simulation.verdict.label}
                </span>
                <p className="text-2xl font-black text-gray-900">{simulation.verdict.text}</p>
                <p className="text-sm text-gray-600">
                  Based on projected attendance of <strong>{simulation.projected}%</strong>.
                </p>
              </div>
            )}

            {selectedSubject && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Recovery Suggestion</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    Attend next {selectedSubject.classesToTarget} classes to be safe
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Safe Bunks</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    You can bunk {selectedSubject.safeBunks} more classes safely
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Impact on Other Subjects</h2>
          {!simulation ? (
            <p className="text-sm text-gray-500">Select a subject to see impact analysis.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Subject</th>
                    <th className="py-2">Before</th>
                    <th className="py-2">After</th>
                  </tr>
                </thead>
                <tbody>
                  {simulation.impactTable.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-2 font-medium text-gray-900">{row.name}</td>
                      <td className="py-2">{row.before}%</td>
                      <td className="py-2">
                        {row.after}%
                        <span className={`ml-2 text-xs ${row.changed ? "text-red-600" : "text-green-600"}`}>
                          {row.changed ? "● Changed" : "● Unchanged"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

