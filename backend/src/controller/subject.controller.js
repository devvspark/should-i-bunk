import Subject from "../models/subject.js";

/* ➕ Add Subject */
export const addSubject = async (req, res) => {
  const { name, totalClasses, attendedClasses, minPercentage } = req.body;

  const subject = await Subject.create({
    user: req.user,
    name,
    totalClasses,
    attendedClasses,
    minPercentage,
  });

  res.status(201).json(subject);
};

/* 🧠 SHOULD I BUNK LOGIC */
export const shouldIBunk = async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  const newTotal = subject.totalClasses + 1;
  const percentage =
    (subject.attendedClasses / newTotal) * 100;

  const safe = percentage >= subject.minPercentage;

  res.json({
    subject: subject.name,
    currentPercentage: percentage.toFixed(2),
    decision: safe ? "YES, YOU CAN BUNK" : "NO, DO NOT BUNK",
    status: safe ? "SAFE" : "DANGER",
  });
};
