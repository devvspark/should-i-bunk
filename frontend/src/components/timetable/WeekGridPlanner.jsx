import { useState } from "react";
import { DAYS_OF_WEEK, TIME_SLOTS, getClassTypeColor } from "../../utils/timetableHelpers";
import GridClassForm from "./GridClassForm";

export default function WeekGridPlanner({ classes, onAddClass, existingClasses = [] }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ========== HANDLE GRID CELL CLICK ========== */
  const handleCellClick = (day, startTime) => {
    setSelectedSlot({ day, startTime });
    setShowForm(true);
  };

  /* ========== CLOSE FORM ========== */
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedSlot(null);
  };

  /* ========== CHECK IF CLASS EXISTS IN SLOT ========== */
  const getClassAtSlot = (day, startTime) => {
    return classes.find(
      (cls) => cls.day === day && cls.startTime === startTime
    );
  };

  return (
    <div className="space-y-4">
      {/* HEADER INFO */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Click on any cell to quickly add a class. The grid shows
          one-hour time slots for easy scheduling.
        </p>
      </div>

      {/* GRID CONTAINER */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full border-collapse min-w-max">
          {/* HEADER - DAYS */}
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <th className="border border-gray-200 px-3 py-3 text-left text-white font-semibold w-24">
                Time
              </th>
              {DAYS_OF_WEEK.map((day) => (
                <th
                  key={day}
                  className="border border-gray-200 px-4 py-3 text-center text-white font-semibold min-w-[120px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY - TIME SLOTS */}
          <tbody>
            {TIME_SLOTS.map((time) => (
              <tr key={time} className="hover:bg-blue-50 transition">
                {/* TIME CELL */}
                <td className="border border-gray-200 px-3 py-3 font-semibold text-gray-700 bg-gray-50 text-sm">
                  {time}
                </td>

                {/* DAY CELLS */}
                {DAYS_OF_WEEK.map((day) => {
                  const classAtSlot = getClassAtSlot(day, time);
                  const nextHour = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;

                  return (
                    <td
                      key={`${day}-${time}`}
                      onClick={() => !classAtSlot && handleCellClick(day, time)}
                      className={`border border-gray-200 px-3 py-2 text-center text-xs cursor-pointer transition h-16 align-top ${
                        classAtSlot
                          ? `${getClassTypeColor(classAtSlot.classType)} border-2 border-gray-400 cursor-default`
                          : "hover:bg-blue-100 bg-white"
                      }`}
                    >
                      {classAtSlot ? (
                        <div className="space-y-1">
                          <p className="font-bold text-sm break-words">
                            {classAtSlot.subject}
                          </p>
                          {classAtSlot.teacherName && (
                            <p className="text-xs opacity-75">
                              {classAtSlot.teacherName}
                            </p>
                          )}
                          {classAtSlot.roomNumber && (
                            <p className="text-xs opacity-75">
                              Rm: {classAtSlot.roomNumber}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs py-2">
                          Click to add
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LEGEND */}
      <div className="bg-white rounded-lg shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-50 border border-blue-200 rounded"></div>
          <span className="text-sm text-gray-700">Lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-50 border border-green-200 rounded"></div>
          <span className="text-sm text-gray-700">Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-50 border border-purple-200 rounded"></div>
          <span className="text-sm text-gray-700">Tutorial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-50 border border-orange-200 rounded"></div>
          <span className="text-sm text-gray-700">Practical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-50 border border-gray-200 rounded"></div>
          <span className="text-sm text-gray-700">Other</span>
        </div>
      </div>

      {/* GRID FORM MODAL */}
      {showForm && selectedSlot && (
        <GridClassForm
          slot={selectedSlot}
          onClose={handleCloseForm}
          onSubmit={onAddClass}
          existingClasses={existingClasses}
        />
      )}
    </div>
  );
}
