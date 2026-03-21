import Subject from "../models/subject.js";
import { calculateAttendance } from "../utils/attendanceCalculator.js";

const getRiskStatus = (percentage, minPercentage) => {
  if (percentage >= minPercentage + 10) return "SAFE";
  if (percentage >= minPercentage) return "WARNING";
  return "DANGER";
};

export const getAnalytics = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.userId }).lean();

    const totalClasses = subjects.reduce(
      (sum, subject) => sum + (Number(subject.totalClasses) || 0),
      0
    );
    const totalAttended = subjects.reduce(
      (sum, subject) => sum + (Number(subject.attendedClasses) || 0),
      0
    );
    const averageMinPercentage =
      subjects.length > 0
        ? subjects.reduce((sum, subject) => sum + (Number(subject.minPercentage) || 75), 0) /
          subjects.length
        : 75;
    const overallPercentage =
      totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
    const overallStatus = getRiskStatus(overallPercentage, averageMinPercentage);

    const subjectAnalytics = subjects.map((subject) => {
      const total = Number(subject.totalClasses) || 0;
      const attended = Number(subject.attendedClasses) || 0;
      const min = Number(subject.minPercentage) || 75;

      const analysis =
        total > 0
          ? calculateAttendance(total, attended, min)
          : {
              currentPercentage: 0,
              isSafe: false,
              safeBunks: 0,
              classesToTarget: 0,
            };

      return {
        id: subject._id,
        name: subject.name,
        totalClasses: total,
        attendedClasses: attended,
        minPercentage: min,
        percentage: Number(analysis.currentPercentage || 0),
        status: getRiskStatus(Number(analysis.currentPercentage || 0), min),
        safeBunks: analysis.safeBunks,
        classesToTarget: analysis.classesToTarget,
      };
    });

    return res.status(200).json({
      success: true,
      overall: {
        percentage: Number(overallPercentage.toFixed(1)),
        status: overallStatus,
        totalAttended,
        totalClasses,
      },
      subjects: subjectAnalytics,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

