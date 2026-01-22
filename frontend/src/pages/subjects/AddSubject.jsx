






import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/landingpage/Navbar";
import toast from "react-hot-toast";
export default function AddSubject() {
  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: "",
    totalClasses: 0,
    attendedClasses: 0,
    minPercentage: 75,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* 🔢 Live percentage calculation */
  const percentage = useMemo(() => {
    if (!form.totalClasses) return 0;
    return ((form.attendedClasses / form.totalClasses) * 100).toFixed(1);
  }, [form]);

  const isSafe = percentage >= form.minPercentage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await axiosInstance.post("/subjects", {
        name: form.name,
        totalClasses: Number(form.totalClasses),
        attendedClasses: Number(form.attendedClasses),
        minPercentage: Number(form.minPercentage),
      });
        toast.success("Subject added successfully!", { duration: 3000 });
      navigate("/subjects");

    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
     <Navbar />
     
      {/* Header */}
      <h1 className="text-2xl font-black mb-1">Add Subject</h1>
      <p className="text-gray-500 mb-8">
        Adjust your attendance parameters to see your academic safety margin.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT FORM */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-6"
        >
          {/* Subject Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              SUBJECT NAME
            </label>
            <input
              name="name"
              placeholder="Advanced Mathematics"
              className="w-full mt-1 h-11 px-4 border rounded-lg"
              onChange={handleChange}
            />
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">
                TOTAL LECTURES HELD
              </label>
              <input
                name="totalClasses"
                type="number"
                className="w-full mt-1 h-11 px-4 border rounded-lg"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">
                LECTURES ATTENDED
              </label>
              <input
                name="attendedClasses"
                type="number"
                className="w-full mt-1 h-11 px-4 border rounded-lg"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-500">
                MINIMUM REQUIRED ATTENDANCE
              </label>
              <span className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-700">
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
              className="w-full"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/subjects")}
              className="px-6 h-10 border rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="px-6 h-10 bg-teal-600 text-white font-semibold rounded-lg"
            >
              {loading ? "Saving..." : "Save Subject"}
            </button>
          </div>
        </form>

        {/* RIGHT ANALYSIS CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
          <p className="text-xs font-semibold text-teal-600 mb-4">
            ANALYSIS PREVIEW
          </p>

          {/* Circular feel */}
          <div className="relative w-36 h-36 rounded-full border-[10px] border-gray-100 flex items-center justify-center mb-4">
            <span className="text-3xl font-black text-gray-800">
              {percentage}%
            </span>
          </div>

          <span
            className={`px-3 py-1 text-xs rounded-full mb-3 ${
              isSafe
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isSafe ? "Safe Standing" : "At Risk"}
          </span>

          <h3 className="font-bold">{form.name || "Subject Name"}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {isSafe
              ? `You are ${(percentage - form.minPercentage).toFixed(
                  1
                )}% above your minimum`
              : `You are ${(form.minPercentage - percentage).toFixed(
                  1
                )}% below required`}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xl font-black text-teal-600">
                {Math.max(
                  0,
                  Math.floor(
                    (form.attendedClasses -
                      (form.minPercentage / 100) * form.totalClasses) /
                      (form.minPercentage / 100)
                  )
                )}
              </p>
              <p className="text-[10px] text-gray-500">SAFE BUNKS LEFT</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xl font-black">0</p>
              <p className="text-[10px] text-gray-500">CLASSES TO TARGET</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4 italic">
            Tip: Missing one lecture will recalculate your safety instantly.
          </p>
        </div>
      </div>
    </div>
  );
}








