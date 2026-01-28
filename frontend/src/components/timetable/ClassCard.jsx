import { Edit2, Trash2 } from "lucide-react";
import { getClassTypeBadgeColor, getClassDuration } from "../../utils/timetableHelpers";

export default function ClassCard({
  classData,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  return (
    <div className={`border rounded-lg p-4 mb-3 transition hover:shadow-md ${getClassTypeBadgeColor(classData.classType).replace('text-', 'border-').replace('bg-', 'bg-opacity-20')}`}>
      {/* HEADER - TIME AND TYPE */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900">
              {classData.startTime} - {classData.endTime}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getClassTypeBadgeColor(classData.classType)}`}>
              {classData.classType}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {getClassDuration(classData.startTime, classData.endTime)}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(classData)}
            className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
            title="Edit class"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(classData._id)}
            disabled={isDeleting}
            className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 disabled:opacity-50"
            title="Delete class"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUBJECT */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 text-base">
          {classData.subject}
        </h4>
      </div>

      {/* TEACHER NAME */}
      {classData.teacherName && (
        <div className="mb-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Teacher:</span> {classData.teacherName}
          </p>
        </div>
      )}

      {/* LOCATION */}
      <div className="flex gap-4 text-sm text-gray-600">
        {classData.roomNumber && (
          <p>
            <span className="font-semibold">Room:</span> {classData.roomNumber}
          </p>
        )}
        {classData.building && (
          <p>
            <span className="font-semibold">Building:</span> {classData.building}
          </p>
        )}
      </div>
    </div>
  );
}
