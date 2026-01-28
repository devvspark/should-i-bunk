import { useState, useEffect } from "react";
import { X, Loader, Check, BookOpen, User, Clock, Calendar, MapPin, Building2 } from "lucide-react";
import {
  DAYS_OF_WEEK,
  CLASS_TYPES,
  TIME_SLOTS,
  isValidTimeFormat,
} from "../../utils/timetableHelpers";

export default function AddClassForm({
  onClose,
  onSubmit,
  editingClass = null,
  existingClasses = [],
}) {
  const [form, setForm] = useState({
    day: "Monday",
    startTime: "10:00",
    endTime: "11:00",
    subject: "",
    teacherName: "",
    roomNumber: "",
    building: "",
    classType: "Lecture",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ========== POPULATE FORM IF EDITING ========== */
  useEffect(() => {
    if (editingClass) {
      setForm({
        day: editingClass.day,
        startTime: editingClass.startTime,
        endTime: editingClass.endTime,
        subject: editingClass.subject,
        teacherName: editingClass.teacherName || "",
        roomNumber: editingClass.roomNumber || "",
        building: editingClass.building || "",
        classType: editingClass.classType || "Lecture",
      });
    }
  }, [editingClass]);

  /* ========== VALIDATE FORM ========== */
  const validateForm = () => {
    const newErrors = {};

    if (!form.subject.trim()) {
      newErrors.subject = "Subject name is required";
    }

    if (!form.day) {
      newErrors.day = "Please select a day";
    }

    if (!isValidTimeFormat(form.startTime)) {
      newErrors.startTime = "Invalid time format (use HH:MM)";
    }

    if (!isValidTimeFormat(form.endTime)) {
      newErrors.endTime = "Invalid time format (use HH:MM)";
    }

    if (form.startTime >= form.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    // Check for time conflicts
    const hasConflict = existingClasses.some((cls) => {
      if (editingClass && cls._id === editingClass._id) return false; // Skip current class when editing
      if (cls.day !== form.day) return false;

      return (
        form.startTime < cls.endTime && form.endTime > cls.startTime
      );
    });

    if (hasConflict) {
      newErrors.time = "This time slot conflicts with another class";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ========== HANDLE SUBMIT ========== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await onSubmit(form, editingClass?._id);
    setLoading(false);

    if (result.success) {
      onClose();
    }
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
          <h2 className="text-xl font-bold text-gray-900">
            {editingClass ? "Edit Class" : "Add New Class"}
          </h2>
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
                placeholder="e.g., Mathematics, Physics"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                  errors.subject ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
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

            {/* DAY */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                Day *
              </label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-all duration-200 font-medium ${
                  errors.day ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              {errors.day && (
                <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.day}</p>
              )}
            </div>

            {/* TIME SECTION */}
            <div className="grid grid-cols-2 gap-4">
              {/* START TIME */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  Start Time *
                </label>
                <select
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-all duration-200 font-medium ${
                    errors.startTime ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.startTime && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.startTime}</p>
                )}
              </div>

              {/* END TIME */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  End Time *
                </label>
                <select
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-all duration-200 font-medium ${
                    errors.endTime ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.endTime && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.endTime}</p>
                )}
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
              {/* ROOM NUMBER */}
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

              {/* BUILDING */}
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
                  <span>{editingClass ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>{editingClass ? "Update" : "Add"} Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}