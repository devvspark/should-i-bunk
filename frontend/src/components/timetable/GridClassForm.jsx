import { useState, useEffect } from "react";
import { X, Loader, Check, Clock, User, MapPin, Building2, BookOpen } from "lucide-react";
import { CLASS_TYPES, checkTimeOverlap } from "../../utils/timetableHelpers";

export default function GridClassForm({
  slot,
  onClose,
  onSubmit,
  existingClasses = [],
}) {
  const [form, setForm] = useState({
    day: slot.day,
    startTime: slot.startTime,
    endTime: `${(parseInt(slot.startTime) + 1).toString().padStart(2, "0")}:00`,
    subject: "",
    teacherName: "",
    roomNumber: "",
    building: "",
    classType: "Lecture",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ========== VALIDATE FORM ========== */
  const validateForm = () => {
    const newErrors = {};

    if (!form.subject.trim()) {
      newErrors.subject = "Subject name is required";
    }

    if (form.startTime >= form.endTime) {
      newErrors.time = "End time must be after start time";
    }

    // Check for time conflicts
    const hasConflict = existingClasses.some((cls) => {
      if (cls.day !== form.day) return false;
      return form.startTime < cls.endTime && form.endTime > cls.startTime;
    });

    if (hasConflict) {
      newErrors.time = "Time slot conflicts with another class";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ========== HANDLE SUBMIT ========== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await onSubmit(form);
    setLoading(false);

    if (result.success) {
      onClose();
    }
  };

  /* ========== GENERATE END TIME OPTIONS ========== */
  const getEndTimeOptions = () => {
    const startHour = parseInt(form.startTime);
    const options = [];
    
    for (let i = startHour + 1; i <= 19; i++) {
      const time = `${i.toString().padStart(2, "0")}:00`;
      options.push(time);
    }
    
    return options;
  };

  /* ========== GET CLASS TYPE EMOJI ========== */
  const getClassTypeEmoji = (type) => {
    const emojis = {
      "Lecture": "📚",
      "Lab": "🔬",
      "Tutorial": "📝",
      "Practical": "⚙️",
      "Other": "📋"
    };
    return emojis[type] || "📋";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Add New Class
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-teal-600">{slot.day}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600 font-medium">{slot.startTime}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {/* GENERAL ERROR */}
            {errors.time && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
                <span className="text-base">⚠️</span>
                <span>{errors.time}</span>
              </div>
            )}

            {/* SUBJECT */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-600" />
                Subject Name *
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., Mathematics"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                  errors.subject ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
                autoFocus
              />
              {errors.subject && (
                <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.subject}</p>
              )}
            </div>

            {/* TEACHER NAME */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                Teacher Name
              </label>
              <input
                type="text"
                value={form.teacherName}
                onChange={(e) =>
                  setForm({ ...form, teacherName: e.target.value })
                }
                placeholder="e.g., Dr. John Smith"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-all duration-200"
              />
            </div>

            {/* TIME SECTION */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  Start Time
                </label>
                <input
                  type="text"
                  value={form.startTime}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  End Time *
                </label>
                <select
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-all duration-200 font-medium ${
                    errors.time ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  {getEndTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CLASS TYPE */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Class Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CLASS_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, classType: type })}
                    className={`px-3 py-2.5 rounded-xl border-2 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2 ${
                      form.classType === type
                        ? "border-teal-600 bg-teal-50 text-teal-700 shadow-md"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span>{getClassTypeEmoji(type)}</span>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* LOCATION SECTION */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  Room Number
                </label>
                <input
                  type="text"
                  value={form.roomNumber}
                  onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                  placeholder="e.g., 201"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  Building
                </label>
                <input
                  type="text"
                  value={form.building}
                  onChange={(e) => setForm({ ...form, building: e.target.value })}
                  placeholder="e.g., Block A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 font-bold active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Add Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
