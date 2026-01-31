import express from "express";
import {
  getTimetable,
  addClass,
  updateClass,
  deleteClass,
  clearTimetable,
} from "../controller/class.controller.js";
import isAuthenticated from "../middleware/isAuthenticate.js";

const router = express.Router();

/* ================= TIMETABLE ROUTES ================= */
/* All routes are protected with authentication */
/* Note: Attendance history for a subject is under GET /api/sessions/:subjectId */

/* GET - Fetch all classes for user */
router.get("/", isAuthenticated, getTimetable);

/* POST - Add new class */
router.post("/", isAuthenticated, addClass);

/* PUT - Update class */
router.put("/:classId", isAuthenticated, updateClass);

/* DELETE - Delete specific class */
router.delete("/:classId", isAuthenticated, deleteClass);

/* DELETE - Clear entire timetable */
router.delete("/clear/all", isAuthenticated, clearTimetable);

export default router;
