import mongoose from "mongoose";

/**
 * ClassSession Model
 * ------------------------------------------
 * Represents an ACTUAL occurrence of a class (attendance event), NOT the weekly schedule.
 * Weekly Timetable (Class model) only defines WHEN a class should happen.
 * This model records WHAT actually happened: whether the user was PRESENT or ABSENT.
 *
 * Attendance % is derived from ClassSession records (Present count / Total sessions logged).
 * Subject.totalClasses and Subject.attendedClasses are kept in sync when sessions are created.
 */

const classSessionSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // e.g. "10:00" (24-hour)
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    sessionType: {
      type: String,
      enum: ["Lecture", "Lab", "Tutorial", "Practical", "Other"],
      default: "Lecture",
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries: fetch history by subject & user, sorted by date
classSessionSchema.index({ subject: 1, user: 1, date: -1 });

export default mongoose.model("ClassSession", classSessionSchema);
