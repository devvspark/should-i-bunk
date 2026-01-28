import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    startTime: {
      type: String, // Format: "10:00" (24-hour)
      required: true,
    },
    endTime: {
      type: String, // Format: "11:00" (24-hour)
      required: true,
    },
    subject: {
      type: String, // Subject name
      required: true,
    },
    teacherName: {
      type: String,
      default: "",
    },
    roomNumber: {
      type: String,
      default: "",
    },
    building: {
      type: String,
      default: "",
    },
    classType: {
      type: String,
      enum: ["Lecture", "Lab", "Tutorial", "Practical", "Other"],
      default: "Lecture",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
