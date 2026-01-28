import { Calendar } from "lucide-react";

export default function EmptyTimetable({ onAddClick }) {
  return (
    <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
      <div className="text-center">
        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 bg-teal-600" />
          </div>
        </div>

        {/* TEXT */}
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Set Your Weekly Timetable
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Create your course schedule to track classes and manage attendance
          effectively. Add your classes for each day of the week.
        </p>

        {/* BUTTON */}
        <button
          onClick={onAddClick}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Add First Class
        </button>
      </div>
    </div>
  );
}
