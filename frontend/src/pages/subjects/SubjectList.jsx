import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const res = await axiosInstance.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;

    await axiosInstance.delete(`/subjects/${id}`);
    setSubjects(subjects.filter((s) => s._id !== id));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) {
    return <p className="p-6">Loading subjects...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">Your Subjects</h1>
        <button
          onClick={() => navigate("/subjects/add")}
          className="px-5 h-10 bg-teal-600 text-white rounded-lg font-semibold"
        >
          + Add Subject
        </button>
      </div>

      {/* Empty State */}
      {subjects.length === 0 && (
        <p className="text-gray-500">No subjects added yet.</p>
      )}

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject._id}
            className="bg-white rounded-2xl shadow p-5"
          >
            <h3 className="font-bold text-lg">{subject.name}</h3>

            <p className="text-sm text-gray-500 mt-1">
              Attendance: {subject.attendedClasses}/{subject.totalClasses}
            </p>

            <p className="text-sm text-gray-500">
              Min Required: {subject.minPercentage}%
            </p>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() =>
                  navigate(`/subjects/edit/${subject._id}`)
                }
                className="text-teal-600 font-semibold text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteSubject(subject._id)}
                className="text-red-500 font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
