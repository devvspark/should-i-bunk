import ClassSession from "../models/ClassSession.js";
import Subject from "../models/subject.js";

/**
 * Attendance Session Controller
 * ------------------------------------------
 * Handles CRUD for ClassSession (actual attendance events).
 * Does NOT modify Timetable (Class model). Only reads/writes ClassSession
 * and keeps Subject.totalClasses / attendedClasses in sync when logging attendance.
 */

/* ================= CREATE CLASS SESSION (Log attendance) ================= */
export const createSession = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      subjectId,
      day,
      date,
      startTime,
      endTime,
      sessionType,
      status,
    } = req.body;

    if (!subjectId || !day || !date || !startTime || !endTime || !status) {
      return res.status(400).json({
        success: false,
        message:
          "subjectId, day, date, startTime, endTime, and status (PRESENT|ABSENT) are required",
      });
    }

    if (!["PRESENT", "ABSENT"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be PRESENT or ABSENT",
      });
    }

    const subject = await Subject.findOne({
      _id: subjectId,
      user: userId,
    });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Prevent duplicate: same subject, user, date (day), startTime, endTime
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const existing = await ClassSession.findOne({
      subject: subjectId,
      user: userId,
      startTime,
      endTime,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This session is already logged for this date and time.",
      });
    }

    const session = await ClassSession.create({
      subject: subjectId,
      user: userId,
      day,
      date: new Date(date),
      startTime,
      endTime,
      sessionType: sessionType || "Lecture",
      status,
    });

    // Keep Subject counts in sync: one more class held, and one more attended if PRESENT
    await Subject.findByIdAndUpdate(subjectId, {
      $inc: {
        totalClasses: 1,
        attendedClasses: status === "PRESENT" ? 1 : 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Attendance logged successfully",
      session,
    });
  } catch (error) {
    console.error("Create Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to log attendance",
    });
  }
};

/* ================= GET ATTENDANCE HISTORY BY SUBJECT ================= */
export const getSessionsBySubject = async (req, res) => {
  try {
    const userId = req.userId;
    const { subjectId } = req.params;

    const subject = await Subject.findOne({
      _id: subjectId,
      user: userId,
    });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const sessions = await ClassSession.find({
      subject: subjectId,
      user: userId,
    })
      .sort({ date: -1, startTime: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get Sessions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance history",
    });
  }
};

/* ================= UPDATE SESSION STATUS (Edit attendance) ================= */
export const updateSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;
    const { status } = req.body;

    if (!["PRESENT", "ABSENT"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be PRESENT or ABSENT",
      });
    }

    const session = await ClassSession.findOne({
      _id: sessionId,
      user: userId,
    });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const subject = await Subject.findOne({
      _id: session.subject,
      user: userId,
    });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const oldStatus = session.status;
    if (oldStatus === status) {
      return res.status(200).json({
        success: true,
        message: "No change",
        session: { ...session.toObject(), status },
      });
    }

    await ClassSession.findByIdAndUpdate(sessionId, { status });

    // Adjust subject counts: PRESENT→ABSENT: attendedClasses -= 1; ABSENT→PRESENT: attendedClasses += 1
    const delta = status === "PRESENT" ? 1 : -1;
    await Subject.findByIdAndUpdate(session.subject, {
      $inc: { attendedClasses: delta },
    });

    const updated = await ClassSession.findById(sessionId).lean();
    return res.status(200).json({
      success: true,
      message: "Attendance updated",
      session: updated,
    });
  } catch (error) {
    console.error("Update Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update attendance",
    });
  }
};

/* ================= DELETE SESSION (Remove from attendance history) ================= */
export const deleteSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;

    const session = await ClassSession.findOneAndDelete({
      _id: sessionId,
      user: userId,
    });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Adjust subject: one less class; if it was PRESENT, one less attended
    await Subject.findByIdAndUpdate(session.subject, {
      $inc: {
        totalClasses: -1,
        attendedClasses: session.status === "PRESENT" ? -1 : 0,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Attendance entry removed",
    });
  } catch (error) {
    console.error("Delete Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove attendance entry",
    });
  }
};
