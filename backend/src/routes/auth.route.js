import express from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} from "../controller/auth.controller.js";
import isauthenticated from "../middleware/isAuthenticate.js";
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);

// Profile
router.get("/profile", isauthenticated, getProfile);
router.put("/profile", isauthenticated, updateProfile);
router.put("/change-password", isauthenticated, changePassword);

// Logout should work even if token is expired/missing
router.post("/logout", logout);

export default router;