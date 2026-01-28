


import express from "express";
import authRoutes from "./auth.route.js";
import subjectRoutes from "./subject.route.js";
import classRoutes from "./class.route.js";
const router = express.Router();

// Routes
router.use("/auth", authRoutes);
router.use("/subjects", subjectRoutes);
router.use("/classes", classRoutes);

export default router;
