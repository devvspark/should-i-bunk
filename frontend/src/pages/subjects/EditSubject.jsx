import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
    name: "",
    totalClasses: 0,
    attendedClasses: 0,
    minPercentage: 75,
  });

  // Analysis State
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [bunkResult, setBunkResult] = useState(null);
  const [bunkLoading, setBunkLoading] = useState(false);

  /* ================= FETCH SUBJECT ================= */
  const fetchSubject = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/subjects/${id}`);
      const { subject, analysis } = res.data;
      setForm({
        name: subject.name,
        totalClasses: subject.totalClasses,
        attendedClasses: subject.attendedClasses,
        minPercentage: subject.minPercentage,
      });
      setAnalysis(analysis);
    } catch (err) {
      setError("Failed to load subject");
      setTimeout(() => navigate("/subjects"), 2000);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ================= SAVE CHANGES ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      const res = await axiosInstance.put(`/subjects/${id}`, {
        name: form.name,
        totalClasses: Number(form.totalClasses),
        attendedClasses: Number(form.attendedClasses),
        minPercentage: Number(form.minPercentage),
      });

      setAnalysis(res.data.analysis);
      navigate("/subjects");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE SUBJECT ================= */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await axiosInstance.delete(`/subjects/${id}`);
      navigate("/subjects");
    } catch {
      setError("Delete failed");
    }
  };

  /* ================= SHOULD I BUNK TODAY? (Simulate – does not save) ================= */
  const handleShouldIBunk = async () => {
    setBunkLoading(true);
    setBunkResult(null);
    try {
      const res = await axiosInstance.get(`/subjects/${id}/bunk`);
      setBunkResult(res.data);
    } catch (err) {
      setBunkResult({
        message: "Could not calculate",
        analysis: null,
      });
    } finally {
      setBunkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafa]">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/subjects")}
              className="text-teal-600 hover:underline"
            >
              Subjects
            </button>
            <span>/</span>
            <span>Edit {form.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Edit Subject</h1>
        <p className="text-gray-500 mb-8">
          Adjust your attendance parameters to see your academic safety margin.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT FORM ================= */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-6"
          >
            {/* Subject Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Subject Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Total & Attended */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Total Lectures Held
                </label>
                <div className="relative">
                  <input
                    name="totalClasses"
                    type="number"
                    min="0"
                    value={form.totalClasses}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    📅
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Lectures Attended
                </label>
                <div className="relative">
                  <input
                    name="attendedClasses"
                    type="number"
                    min="0"
                    max={form.totalClasses}
                    value={form.attendedClasses}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    👤
                  </span>
                </div>
              </div>
            </div>

            {/* Minimum Required Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-gray-700 uppercase">
                  Minimum Required Attendance
                </label>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-teal-100 text-teal-700">
                  {form.minPercentage}%
                </span>
              </div>
              <input
                name="minPercentage"
                type="range"
                min="0"
                max="100"
                value={form.minPercentage}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${form.minPercentage}%, #e5e7eb ${form.minPercentage}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1"
              >
                🗑️ Delete Subject
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/subjects")}
                  className="px-6 h-11 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 h-11 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>

          {/* ================= RIGHT ANALYSIS PANEL ================= */}
          {analysis && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-xs font-semibold text-teal-600 mb-6 text-center uppercase tracking-wide">
                Analysis Preview
              </p>

              {/* Circular Progress */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={analysis.isSafe ? "#0d9488" : "#ef4444"}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 70 * (1 - analysis.currentPercentage / 100)
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800">
                      {analysis.currentPercentage}%
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Current
                    </span>
                  </div>
                </div>

                <span
                  className={`mt-4 px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                    analysis.isSafe
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {analysis.isSafe ? "✓" : "⚠"} {analysis.isSafe ? "Safe Standing" : "At Risk"}
                </span>
              </div>

              {/* Subject Name */}
              <h3 className="text-lg font-bold text-center text-gray-800 mb-2">
                {form.name}
              </h3>

              {/* Status Message */}
              <p className="text-xs text-gray-500 text-center mb-6">
                You are{" "}
                <span className={analysis.isSafe ? "text-green-600" : "text-red-600"}>
                  {Math.abs(analysis.currentPercentage - form.minPercentage).toFixed(1)}%{" "}
                  {analysis.isSafe ? "above" : "below"}
                </span>{" "}
                your minimum threshold.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-gray-800">
                    {analysis.safeBunks}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                    Safe Bunks Left
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-gray-800">
                    {analysis.classesToTarget}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                    Classes to Target
                  </p>
                </div>
              </div>

              {/* Should I Bunk Today? – Simulates next class as ABSENT without saving */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleShouldIBunk}
                  disabled={bunkLoading}
                  className="w-full h-11 px-4 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition"
                >
                  {bunkLoading ? "Calculating..." : "Should I Bunk Today?"}
                </button>
                {bunkResult && (
                  <div
                    className={`mt-3 p-3 rounded-lg border ${
                      bunkResult.analysis?.isSafe
                        ? "bg-green-50 border-green-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <p className={`text-sm font-bold ${
                      bunkResult.analysis?.isSafe ? "text-green-800" : "text-amber-800"
                    }`}>
                      {bunkResult.message}
                    </p>
                    {bunkResult.analysis && (
                      <p className="text-xs text-gray-600 mt-1">
                        Simulated: next class as absent → {bunkResult.analysis.currentPercentage}% (not saved).
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Info Tip */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="flex gap-2">
                  <span className="text-blue-500 text-sm">💡</span>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Tip:</strong> Bunking the next Friday lecture will bring you down to{" "}
                    <strong>82.2%</strong>. Still well within your <strong>75%</strong> goal.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}