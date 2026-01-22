import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    totalClasses: Number,
    attendedClasses: Number,
    minPercentage: { type: Number, default: 75 },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
