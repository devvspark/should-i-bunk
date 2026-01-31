import Class from "../models/Class.js";

/* ================= GET ALL CLASSES FOR USER ================= */
export const getTimetable = async (req, res) => {
  try {
    const userId = req.userId;

    /* Get all classes for this user, sorted by day */
    const classes = await Class.find({ user: userId }).sort({
      day: 1,
      startTime: 1,
    });

    if (!classes || classes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No timetable found. Please set your weekly timetable.",
        classes: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Timetable fetched successfully",
      classes,
    });
  } catch (error) {
    console.error("Get Timetable Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timetable",
    });
  }
};

/* ================= ADD NEW CLASS ================= */
export const addClass = async (req, res) => {
  try {
    const userId = req.userId;
    const { day, startTime, endTime, subject, teacherName, roomNumber, building, classType } =
      req.body;

    /* VALIDATION */
    if (!day || !startTime || !endTime || !subject) {
      return res.status(400).json({
        success: false,
        message: "Day, start time, end time, and subject are required",
      });
    }

    /* Check time validity */
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    /* Check for time conflicts */
    const conflictingClass = await Class.findOne({
      user: userId,
      day,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflictingClass) {
      return res.status(400).json({
        success: false,
        message: "Class time overlaps with another class on the same day",
      });
    }

    /* CREATE CLASS */
    const newClass = await Class.create({
      user: userId,
      day,
      startTime,
      endTime,
      subject,
      teacherName: teacherName || "",
      roomNumber: roomNumber || "",
      building: building || "",
      classType: classType || "Lecture",
    });

    return res.status(201).json({
      success: true,
      message: "Class added successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("Add Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add class",
    });
  }
};

/* ================= UPDATE CLASS ================= */
export const updateClass = async (req, res) => {
  try {
    const userId = req.userId;
    const { classId } = req.params;
    const { day, startTime, endTime, subject, teacherName, roomNumber, building, classType } =
      req.body;

    /* Find the class and verify ownership */
    const classData = await Class.findOne({
      _id: classId,
      user: userId,
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    /* VALIDATION */
    if (!day || !startTime || !endTime || !subject) {
      return res.status(400).json({
        success: false,
        message: "Day, start time, end time, and subject are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    /* Check for time conflicts (excluding current class) */
    const conflictingClass = await Class.findOne({
      user: userId,
      day,
      _id: { $ne: classId },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflictingClass) {
      return res.status(400).json({
        success: false,
        message: "Class time overlaps with another class on the same day",
      });
    }

    /* UPDATE CLASS */
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        day,
        startTime,
        endTime,
        subject,
        teacherName: teacherName || "",
        roomNumber: roomNumber || "",
        building: building || "",
        classType: classType || "Lecture",
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Update Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update class",
    });
  }
};

/* ================= DELETE CLASS ================= */
export const deleteClass = async (req, res) => {
  try {
    const userId = req.userId;
    const { classId } = req.params;

    /* Find and delete the class (verify ownership) */
    const deletedClass = await Class.findOneAndDelete({
      _id: classId,
      user: userId,
    });

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Delete Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete class",
    });
  }
};

/* ================= DELETE ALL CLASSES FOR USER ================= */
export const clearTimetable = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await Class.deleteMany({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Timetable cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear Timetable Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear timetable",
    });
  }
};


/* Attendance history is now served by session.controller.js (GET /api/sessions/:subjectId) */