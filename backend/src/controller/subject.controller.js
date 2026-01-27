import Subject from "../models/subject.js";
import { calculateAttendance } from "../utils/attendanceCalculator.js";
/* ➕ Add Subject */
export const addSubject = async (req, res) => {
  const { name, totalClasses, attendedClasses, minPercentage } = req.body;

  const subject = await Subject.create({
    user: req.userId,
    name,
    totalClasses,
    attendedClasses,
    minPercentage,
  });

  res.status(201).json(subject);
};

  

export const shouldIBunk = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // simulate bunking ONE upcoming class
    const analysis = calculateAttendance(
      subject.totalClasses + 1,     
      subject.attendedClasses,      
      subject.minPercentage
    );

    res.json({
      message: analysis.isSafe
        ? "YES, YOU CAN BUNK"
        : "NO, DO NOT BUNK",
      subject,
      analysis,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { name, totalClasses, attendedClasses, minPercentage } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, totalClasses, attendedClasses, minPercentage },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const analysis = calculateAttendance(
      subject.totalClasses,
      subject.attendedClasses,
      subject.minPercentage
    );

    res.json({
      message: "Subject updated",
      subject,
      analysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




export const deleteSubject = async (req, res) => {
  await Subject.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  res.json({ message: "Subject deleted" });
};


// 📄 GET all subjects of logged-in user
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
     const analysis = calculateAttendance(
      subject.totalClasses,
      subject.attendedClasses,
      subject.minPercentage
    );

    res.json({ subject, analysis });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
