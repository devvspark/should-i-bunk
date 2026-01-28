import { useState } from "react";
import { Loader, Plus, Grid, ListPlus } from "lucide-react";
import { useTimetable } from "../hooks/useTimetable";
import EmptyTimetable from "../components/timetable/EmptyTimetable";
import TimetableView from "../components/timetable/TimetableView";
import AddClassForm from "../components/timetable/AddClassForm";
import WeekGridPlanner from "../components/timetable/WeekGridPlanner";

export default function Timetable() {
  const { classes, loading, error, addClass, updateClass, deleteClass, clearTimetable } = useTimetable();
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"

  /* ========== HANDLE ADD/UPDATE CLASS ========== */
  const handleSubmitClass = async (formData, classId) => {
    if (classId) {
      // Update existing class
      return await updateClass(classId, formData);
    } else {
      // Add new class
      return await addClass(formData);
    }
  };

  /* ========== HANDLE EDIT ========== */
  const handleEdit = (classData) => {
    setEditingClass(classData);
    setShowForm(true);
  };

  /* ========== HANDLE CLOSE FORM ========== */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClass(null);
  };

  /* ========== LOADING STATE ========== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your timetable...</p>
        </div>
      </div>
    );
  }

  /* ========== ERROR STATE ========== */
  if (error && classes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* EMPTY STATE */}
        {classes.length === 0 ? (
          <div>
            <EmptyTimetable onAddClick={() => setShowForm(true)} />
          </div>
        ) : (
          <div>
            {/* HEADER WITH VIEW MODE TOGGLE */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Weekly Timetable</h1>
                <p className="text-gray-600 mt-1">Total classes: <span className="font-semibold">{classes.length}</span></p>
              </div>

              {/* VIEW MODE BUTTONS */}
              <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold ${
                    viewMode === "list"
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ListPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add One</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold ${
                    viewMode === "grid"
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Quick Add</span>
                </button>
              </div>
            </div>

            {/* LIST VIEW MODE */}
            {viewMode === "list" ? (
              <div>
                {/* ACTION BUTTON */}
                <div className="mb-8">
                  <button
                    onClick={() => {
                      setEditingClass(null);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    Add Class
                  </button>
                </div>

                {/* TIMETABLE VIEW */}
                <TimetableView
                  classes={classes}
                  onEdit={handleEdit}
                  onDelete={deleteClass}
                  onClear={clearTimetable}
                />
              </div>
            ) : (
              /* GRID VIEW MODE */
              <div>
                <WeekGridPlanner
                  classes={classes}
                  onAddClass={handleSubmitClass}
                  existingClasses={classes}
                />
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT FORM MODAL */}
        {showForm && viewMode === "list" && (
          <AddClassForm
            onClose={handleCloseForm}
            onSubmit={handleSubmitClass}
            editingClass={editingClass}
            existingClasses={classes}
          />
        )}
      </div>
    </div>
  );
}
