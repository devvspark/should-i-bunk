import { useState } from "react";
import { Trash2 } from "lucide-react";
import ClassCard from "./ClassCard";
import { DAYS_OF_WEEK, groupClassesByDay } from "../../utils/timetableHelpers";

export default function TimetableView({
  classes,
  onEdit,
  onDelete,
  onClear,
}) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [deletingId, setDeletingId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const classesByDay = groupClassesByDay(classes);
  const todaysClasses = classesByDay[selectedDay] || [];

  /* ========== HANDLE DELETE ========== */
  const handleDelete = async (classId) => {
    setDeletingId(classId);
    await onDelete(classId);
    setDeletingId(null);
  };

  /* ========== HANDLE CLEAR ALL ========== */
  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete all classes? This action cannot be undone.")) {
      setShowClearConfirm(true);
      await onClear();
      setShowClearConfirm(false);
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER WITH CLEAR BUTTON */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Timetable</h1>
          <p className="text-gray-600 mt-1">
            Total classes: <span className="font-semibold">{classes.length}</span>
          </p>
        </div>
        {classes.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={showClearConfirm}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 px-4 py-2 rounded-lg transition font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* DAY TABS */}
      <div className="bg-white rounded-lg shadow-sm p-2 flex gap-2 overflow-x-auto">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap font-semibold ${
              selectedDay === day
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {day}
            {classesByDay[day]?.length > 0 && (
              <span className="ml-2 bg-opacity-50 px-2 py-0.5 rounded-full text-xs">
                ({classesByDay[day].length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CLASSES FOR SELECTED DAY */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {selectedDay}'s Classes
        </h2>

        {todaysClasses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No classes scheduled for {selectedDay}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todaysClasses.map((cls) => (
              <ClassCard
                key={cls._id}
                classData={cls}
                onEdit={onEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === cls._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* WEEK OVERVIEW */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Week Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedDay(day)}
            >
              <p className="text-sm font-semibold text-gray-700">{day}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {classesByDay[day]?.length || 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">classes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
