import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import axiosInstance from "../../utils/axiosInstance";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SESSION_TYPES = ["Lecture", "Lab", "Tutorial", "Practical", "Other"];

function getDayFromDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
}

function formatSessionLabel(session) {
  const hour = parseInt(session.startTime?.slice(0, 2) || "9", 10);
  const type = session.sessionType || "Lecture";
  if (type === "Lab") return "Lab Session";
  return hour < 12 ? "Morning Session" : "Evening Session";
}

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = (t || "09:00").split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [bunkResult, setBunkResult] = useState(null);
  const [bunkLoading, setBunkLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // sessionId for edit/delete in progress
  const [sessionForm, setSessionForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "10:00",
    sessionType: "Lecture",
  });
  const [sessionSaving, setSessionSaving] = useState(false);
  const [logError, setLogError] = useState("");

  const fetchSubject = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/subjects/${id}`);
      setSubject(res.data.subject);
      setAnalysis(res.data.analysis);
    } catch {
      setSubject(null);
      setAnalysis(null);
      setTimeout(() => navigate("/dashboard"), 2000);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchSessions = useCallback(async () => {
    if (!id) return;
    setSessionsLoading(true);
    try {
      const res = await axiosInstance.get(`/sessions/subject/${id}`);
      const raw = res.data.sessions || [];
      // Deduplicate by date + startTime + endTime (keep first occurrence)
      const seen = new Set();
      const deduped = raw.filter((s) => {
        const d = new Date(s.date);
        const dateKey = d.toISOString().slice(0, 10);
        const key = `${dateKey}_${s.startTime}_${s.endTime}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setSessions(deduped);
    } catch {
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject]);

  useEffect(() => {
    if (!id || loading) return;
    fetchSessions();
  }, [id, loading, fetchSessions]);

  const handleShouldIBunk = async () => {
    setBunkLoading(true);
    setBunkResult(null);
    try {
      const res = await axiosInstance.get(`/subjects/${id}/bunk`);
      setBunkResult(res.data);
    } catch {
      setBunkResult({ message: "Could not calculate", analysis: null });
    } finally {
      setBunkLoading(false);
    }
  };

  const handleLogAttendance = async (status) => {
    const day = getDayFromDate(sessionForm.date);
    if (!day) return;
    setSessionSaving(true);
    setLogError("");
    try {
      await axiosInstance.post("/sessions", {
        subjectId: id,
        day,
        date: sessionForm.date,
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        sessionType: sessionForm.sessionType,
        status,
      });
      await fetchSubject();
      await fetchSessions();
      setBunkResult(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to log attendance";
      setLogError(msg);
    } finally {
      setSessionSaving(false);
    }
  };

  const handleEditAttendance = async (session) => {
    const newStatus = session.status === "PRESENT" ? "ABSENT" : "PRESENT";
    setActionLoading(session._id);
    try {
      await axiosInstance.patch(`/sessions/${session._id}`, { status: newStatus });
      await fetchSubject();
      await fetchSessions();
      setBunkResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveAttendance = async (session) => {
    if (!window.confirm("Remove this attendance entry? Subject counts will be updated.")) return;
    setActionLoading(session._id);
    try {
      await axiosInstance.delete(`/sessions/${session._id}`);
      await fetchSubject();
      await fetchSessions();
      setBunkResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !subject) {
    return (
      <div className="min-h-screen flex bg-[#f7fafa]">
        <div className="fixed left-0 top-0 h-screen z-20">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col ml-0 lg:ml-64 pt-16 lg:pt-20 p-6 items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const percentage = subject.totalClasses > 0
    ? ((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1)
    : "0";
  const margin = analysis ? (analysis.currentPercentage - subject.minPercentage).toFixed(1) : "0";
  const statusLabel = analysis?.isSafe ? "SAFE STATUS" : "AT RISK";
  const statusBg = analysis?.isSafe ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700";
  const greeting = analysis?.isSafe
    ? `You can bunk ${analysis.safeBunks} more classes this week and still stay above your ${subject.minPercentage}% goal.`
    : `You need to attend ${analysis?.classesToTarget ?? 0} more classes to reach your ${subject.minPercentage}% goal.`;

  return (
    <div className="min-h-screen flex bg-[#f7fafa]">
      <div className="fixed left-0 top-0 h-screen z-20">
        <Sidebar />
      </div>
      <div className="fixed top-0 left-0 right-0 lg:left-64 z-10">
        <TopHeader />
      </div>

      <main className="flex-1 flex flex-col ml-0 lg:ml-64 pt-16 lg:pt-20 p-6 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/subjects")} className="text-teal-600 hover:underline">
            Subjects
          </button>
          <span>/</span>
          <span>{subject.name}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">{subject.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Status + Metrics + Attendance History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${statusBg}`}>
                    {statusLabel}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-3">You&apos;re doing great!</h2>
                  <p className="text-sm text-gray-600 mt-1">{greeting}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Attendance Goal</span>
                      <span>{subject.minPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, subject.minPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={analysis?.isSafe ? "#0d9488" : "#ef4444"}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (subject.totalClasses ? subject.attendedClasses / subject.totalClasses : 0))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-gray-800">{percentage}%</span>
                      <span className="text-[10px] text-gray-400 uppercase">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attended</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{subject.attendedClasses} Sessions logged</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{subject.totalClasses} Class sessions</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Threshold</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{subject.minPercentage}% Min. required</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Margin</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{margin >= 0 ? "+" : ""}{margin}% Above limit</p>
              </div>
            </div>

            {/* Log attendance – Mark as Present / Absent */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Log attendance</h3>
              <p className="text-sm text-gray-500 mb-4">
                Log attendance when you attend or miss a class. Counts update automatically.
              </p>
              {logError && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  {logError}
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start</label>
                    <input
                      type="time"
                      value={sessionForm.startTime}
                      onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                      className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End</label>
                    <input
                      type="time"
                      value={sessionForm.endTime}
                      onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                      className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Type</label>
                    <select
                      value={sessionForm.sessionType}
                      onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value })}
                      className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm"
                    >
                      {SESSION_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleLogAttendance("PRESENT")}
                      disabled={sessionSaving}
                      className="flex-1 h-9 px-3 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Mark Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLogAttendance("ABSENT")}
                      disabled={sessionSaving}
                      className="flex-1 h-9 px-3 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Mark Absent
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance History with Edit & Remove */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Attendance History</h3>
                <button
                  onClick={() => navigate(`/subjects/edit/${id}`)}
                  className="text-teal-600 text-sm font-semibold hover:underline"
                >
                  Edit subject
                </button>
              </div>
              {sessionsLoading ? (
                <p className="text-sm text-gray-500">Loading history...</p>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-gray-500">No attendance logged yet. Use the form above to mark a class as Present or Absent.</p>
              ) : (
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                  {sessions.map((session) => (
                    <li
                      key={session._id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 px-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-medium text-gray-800 shrink-0">
                          {formatSessionLabel(session)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(session.date)} • {formatTime(session.startTime)}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full uppercase shrink-0 ${
                            session.status === "PRESENT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditAttendance(session)}
                          disabled={actionLoading === session._id}
                          className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline disabled:opacity-50"
                        >
                          {/* {actionLoading === session._id ? "..." : "Edit"} */}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttendance(session)}
                          disabled={actionLoading === session._id}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT: Make a Decision, Bunk Simulator, Recovery Goal */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Make a Decision</h3>
              <p className="text-sm text-gray-600 mb-4">
                Should you bunk the next lecture? Based on your current {percentage}% attendance, skipping one class is {analysis?.isSafe ? "safe." : "risky."}
              </p>
              <button
                type="button"
                onClick={handleShouldIBunk}
                disabled={bunkLoading}
                className="w-full h-11 px-4 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">help</span>
                {bunkLoading ? "Calculating..." : "Should I Bunk Today?"}
              </button>
              {bunkResult && (
                <div
                  className={`mt-3 p-3 rounded-lg border ${
                    bunkResult.analysis?.isSafe ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <p className={`text-sm font-bold ${bunkResult.analysis?.isSafe ? "text-green-800" : "text-amber-800"}`}>
                    {bunkResult.message}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => navigate(`/subjects/edit/${id}`)}
                className="w-full mt-3 h-10 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Open Recovery Planner
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bunk Simulator</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Planned Absences</p>
              <p className="text-2xl font-bold text-gray-900">{analysis?.safeBunks ?? 0} Classes</p>
              <p className="text-sm text-gray-600 mt-2">Impact: {analysis ? `-${(100 * (1 - (subject.attendedClasses / (subject.totalClasses + (analysis.safeBunks || 0))))).toFixed(1)}%` : "—"}</p>
              <p className="text-sm text-gray-600">Forecast: {analysis ? ((subject.attendedClasses / (subject.totalClasses + 1)) * 100).toFixed(1) : "—"}%</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recovery Goal</h3>
              <p className="text-sm text-gray-600">
                To reach your ultimate target of {subject.minPercentage}% attendance, you must attend the next {analysis?.classesToTarget ?? 0} classes consecutively without skipping.
              </p>
            </div>
          </div>
        </div>

        {/* Edit subject link */}
        <div className="mt-6">
          <button
            onClick={() => navigate(`/subjects/edit/${id}`)}
            className="text-teal-600 font-semibold text-sm hover:underline"
          >
            Edit subject & attendance →
          </button>
        </div>
      </main>
    </div>
  );
}
