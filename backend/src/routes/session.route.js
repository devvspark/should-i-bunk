import express from "express";
import {
  createSession,
  getSessionsBySubject,
  updateSession,
  deleteSession,
} from "../controller/session.controller.js";
import isAuthenticated from "../middleware/isAuthenticate.js";

const router = express.Router();

/* All routes require authentication */

/* POST - Log attendance (create a class session record) */
router.post("/", isAuthenticated, createSession);

/* GET - Fetch attendance history for a subject (sorted by date desc) */
router.get("/subject/:subjectId", isAuthenticated, getSessionsBySubject);

/* PATCH - Update session status (edit attendance: PRESENT ↔ ABSENT) */
router.patch("/:sessionId", isAuthenticated, updateSession);

/* DELETE - Remove attendance entry */
router.delete("/:sessionId", isAuthenticated, deleteSession);

export default router;
