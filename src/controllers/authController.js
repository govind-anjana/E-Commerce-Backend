import AdminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * POST /api/auth/signup
 * Create a new admin
 */
export const signupAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      let conflictField = "Admin";
      if (existingAdmin.username === username) conflictField = "Username";
      else if (existingAdmin.email === email) conflictField = "Email";

      return res.status(400).json({
        success: false,
        message: `${conflictField} already exists`,
      });
    }

    const newAdmin = new AdminModel({ username, email, password });
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error("signupAdmin Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during admin signup",
      error: err.message,
    });
  }
};

/**
 * POST /api/auth/login
 * Admin login
 */
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Note: admin_id is used here to match the authValidator.js adminloginSchema
     

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const admin = await AdminModel.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("loginAdmin Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
};
