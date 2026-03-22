import express from "express";
import isAuthenticated from "../middleware/isAuthenticate.js";
import { getAnalytics } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getAnalytics);

export default router;
