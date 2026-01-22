import express from "express";
import { signup, login } from "../controller/auth.controller.js";
import isauthenticated from "../middleware/isAuthenticate.js";
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);

export default router;