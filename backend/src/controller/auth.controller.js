import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const { name, email, password, branch, acceptedTerms } = req.body;

    /* ================= VALIDATION ================= */
    if (!name || !email || !password || !branch) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!acceptedTerms) {
      return res.status(400).json({
        success: false,
        message: "You must accept Terms & Conditions",
      });
    }

    /* ================= CHECK USER ================= */
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    /* ================= HASH PASSWORD ================= */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= CREATE USER ================= */
    await User.create({
      name,
      email,
      password: hashedPassword,
      branch, 
      acceptedTerms,
    });

    /* ================= RESPONSE ================= */
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, branch } = req.body;

    /* ================= VALIDATION ================= */
    if (!email || !password || !branch) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and branch are required",
      });
    }

    /* ================= FIND USER ================= */
    const user = await User.findOne({ email }).select('+password'); // Select password field which is excluded by default
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* ================= COMPARE PASSWORD ================= */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

     // ✅ CREATE JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ SET COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET PROFILE (from JWT cookie) ================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        branch: user.branch,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= UPDATE PROFILE (name, branch) ================= */
export const updateProfile = async (req, res) => {
  try {
    const { name, branch } = req.body;
    if (!name || !branch) {
      return res.status(400).json({
        success: false,
        message: "Name and branch are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, branch },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        branch: user.branch,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new passwords are required",
      });
    }

    const user = await User.findById(req.userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= LOGOUT (clear cookie) ================= */
export const logout = (req, res) => {
  try {
    // Must match cookie path/options used at set-cookie time
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};