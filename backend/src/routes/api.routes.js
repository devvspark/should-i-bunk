


import express from "express";
import authRoutes from "./auth.route.js";
import subjectRoutes from "./subject.route.js";
const router = express.Router();

// Only auth exists currently
router.use("/auth", authRoutes);
router.use("/subjects", subjectRoutes);

export default router;
