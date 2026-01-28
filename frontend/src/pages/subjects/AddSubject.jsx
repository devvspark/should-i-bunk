

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
  const isInvalid = form.attendedClasses > form.totalClasses ;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset error on change
    setError("");
    
    // Handle text input for subject name
    if (name === "name") {
      setForm({
        ...form,
        [name]: value
      });
      return;
    }
    
    const num = Number(value);
    
    // If it's not a valid number for other fields, return
    if (Number.isNaN(num)) return;

    // Rule 1: totalClasses must be at least 0
    if (name === "totalClasses" && num < 0) {
      setError("Total lectures must be at least 0");
      return;
    }
    
    // Rule 2: Ensure attendedClasses never exceeds totalClasses
    if (name === "attendedClasses") {
      const maxAllowed = form.totalClasses || 0;
      const finalValue = Math.min(num, maxAllowed);
      
      setForm({
        ...form,
        [name]: finalValue
      });
      return;
    }
    
    // Rule 3: When totalClasses is reduced below attendedClasses, adjust attendedClasses
    if (name === "totalClasses" && num < form.attendedClasses) {
      setForm({
        ...form,
        totalClasses: num,
        attendedClasses: num, // Auto-adjust attended to match new total
      });
      return;
    }
    
    // Rule 4: Handle minPercentage (slider)
    if (name === "minPercentage") {
      setForm({
        ...form,
        [name]: Math.min(100, Math.max(0, num)) // Clamp between 0-100
      });
      return;
    }
    
    // Default case for other numeric fields
    setForm({
      ...form,
      [name]: num
    });
  };

  /* ================= LIVE PREVIEW USING useMemo ================= */
  const percentage = useMemo(() => {
    if (isInvalid) return 0;
    return ((form.attendedClasses / form.totalClasses) * 100).toFixed(1);
  }, [form, isInvalid]);

  const isSafe = percentage >= form.minPercentage;

  const safeBunksLeft = useMemo(() => {
    if (isInvalid) return 0;
    
    let tempTotal = form.totalClasses;
    let bunks = 0;

    while (
      ((form.attendedClasses / (tempTotal + 1)) * 100) >= form.minPercentage
    ) {
      tempTotal++;
      bunks++;
    }

    return bunks;
  }, [form, isInvalid]);

  const classesToTarget = useMemo(() => {
    if (isInvalid) return 0;

    let target = 0;
    while (
      ((form.attendedClasses + target) /
        (form.totalClasses + target)) *
        100 <
      form.minPercentage
    ) {
      target++;
    }

    return target;
  }, [form, isInvalid]);

  const stepByStepAnalysis = useMemo(() => {
    if (isInvalid) return [];
    
    const steps = [];
    const currentPercentage = percentage;
    const targetPercentage = form.minPercentage;
    
    // Current status
    steps.push({
      step: 1,
      title: "Current Status",
      description: `You have attended ${form.attendedClasses} of ${form.totalClasses} classes.`,
      value: `${currentPercentage}%`,
      status: isSafe ? "safe" : "warning"
    });
    
    // Bunk analysis
    if (isSafe) {
      steps.push({
        step: 2,
        title: "Bunk Safety",
        description: `You can bunk up to ${safeBunksLeft} more classes while staying above ${targetPercentage}%.`,
        value: `+${safeBunksLeft} classes`,
        status: "safe"
      });
      
      // Show what happens after bunking 1 class
      if (safeBunksLeft > 0) {
        const newPercentage = ((form.attendedClasses) / (form.totalClasses + 1) * 100).toFixed(1);
        steps.push({
          step: 3,
          title: "After bunking 1 class",
          description: `Total: ${form.totalClasses + 1}, Attended: ${form.attendedClasses}`,
          value: `${newPercentage}%`,
          status: "info"
        });
      }
    } else {
      // Need to attend classes
      steps.push({
        step: 2,
        title: "Recovery Required",
        description: `You need to attend ${classesToTarget} more classes to reach ${targetPercentage}%.`,
        value: `Need ${classesToTarget}`,
        status: "warning"
      });
      
      // Show progress after attending required classes
      if (classesToTarget > 0) {
        const newPercentage = ((form.attendedClasses + classesToTarget) / (form.totalClasses + classesToTarget) * 100).toFixed(1);
        steps.push({
          step: 3,
          title: "After attending required classes",
          description: `Total: ${form.totalClasses + classesToTarget}, Attended: ${form.attendedClasses + classesToTarget}`,
          value: `${newPercentage}%`,
          status: "safe"
        });
      }
    }
    
    return steps;
  }, [form, percentage, isSafe, safeBunksLeft, classesToTarget, isInvalid]);

  /* ================= SAVE (BACKEND) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (form.attendedClasses > form.totalClasses) {
      setError("Attended lectures cannot exceed total lectures");
      return;
    }

    if (form.totalClasses < 1) {
      setError("Total lectures must be at least 1");
      return;
    }

    if (!form.name.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/subjects", {
        name: form.name,
        totalClasses: Number(form.totalClasses),
        attendedClasses: Number(form.attendedClasses),
        minPercentage: Number(form.minPercentage),
      });

      toast.success("Subject added successfully!");
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
          <div>
            <label className="text-xs font-semibold text-gray-500">
              SUBJECT NAME
            </label>
            <input
              name="name"
              value={form.name}
              placeholder="Advanced Mathematics"
              className="w-full mt-1 h-11 px-4 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">
                TOTAL LECTURES HELD
              </label>
              <input
                name="totalClasses"
                type="number"
                min="0"
                value={form.totalClasses}
                placeholder="Total Lectures"
                className="w-full mt-1 h-11 px-4 border rounded-lg"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-500">
                  LECTURES ATTENDED
                </label>
                <span className="text-xs text-gray-400">
                  Max: {form.totalClasses || 0}
                </span>
              </div>
              <input
                name="attendedClasses"
                type="number"
                min="0"
                max={form.totalClasses}
                value={form.attendedClasses}
                placeholder="Attended Lectures"
                className={`w-full mt-1 h-11 px-4 border rounded-lg ${
                  form.attendedClasses > form.totalClasses 
                    ? 'border-red-500 bg-red-50' 
                    : ''
                }`}
                onChange={handleChange}
              />
              {form.totalClasses > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (form.attendedClasses / form.totalClasses) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span>
                      {form.attendedClasses} / {form.totalClasses}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

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
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/subjects")}
              className="px-6 h-10 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={loading || isInvalid || !form.name.trim()}
              className="px-6 h-10 bg-teal-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
            >
              {loading ? "Saving..." : "Save Subject"}
            </button>
          </div>
        </form>

        {/* RIGHT ANALYSIS CARD */}
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-xs font-semibold text-teal-600 mb-4 text-center">
            STEP-BY-STEP ANALYSIS
          </p>

          <div className="mb-6 flex flex-col items-center">
            <div className="relative w-36 h-36 rounded-full border-[10px] border-gray-100 flex items-center justify-center mb-4">
              <span className="text-3xl font-black text-gray-800">
                {percentage}%
              </span>
            </div>
            
            <span className={`px-3 py-1 text-xs rounded-full mb-3 ${
              isSafe ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {isSafe ? "✓ Safe Standing" : "⚠ At Risk"}
            </span>
            
            <h3 className="font-bold">{form.name || "Subject Name"}</h3>
          </div>

          {/* Step-by-step analysis */}
          <div className="space-y-4">
            {stepByStepAnalysis.map((step) => (
              <div 
                key={step.step} 
                className={`p-3 rounded-lg border ${
                  step.status === 'safe' ? 'border-green-200 bg-green-50' :
                  step.status === 'warning' ? 'border-red-200 bg-red-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        step.status === 'safe' ? 'bg-green-200 text-green-800' :
                        step.status === 'warning' ? 'bg-red-200 text-red-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        Step {step.step}
                      </span>
                      <span className="text-sm font-semibold">{step.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{step.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xl font-black text-teal-600">
                {safeBunksLeft}
              </p>
              <p className="text-[10px] text-gray-500">
                SAFE BUNKS LEFT
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xl font-black">
                {isSafe ? 0 : classesToTarget}
              </p>
              <p className="text-[10px] text-gray-500">
                CLASSES TO ATTEND
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4 italic text-center">
            Tip: Every change updates analysis in real-time
          </p>
        </div>
      </div>
    </div>
  );
}