import { otpStore } from "../utils/tempStore.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userauthModel.js";

export const allUsers=async(req,res)=>{
    try {
    const data = await User.find();
    if (!data.length) return res.status(404).json({ message: "No users found" });
    res.status(200).json({ message: "All users fetch successfully", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Initiates User Signup by sending OTPs to email and phone.
 * Data is stored in a temporary in-memory store until verified.
 */
export const signup = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    if(!username || !email || !phone || !password){
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // generate OTP
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // store in memory (NOT DB)
    otpStore.set(email, {
      username,
      email,
      phone,
      password,
      emailOtp,
      phoneOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log("Email OTP:", emailOtp);
    console.log("Phone OTP:", phoneOtp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email and phone. It will expire in 5 minutes.",
      emailOtp, // dev only, should be sent via email service
      phoneOtp, // dev only
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Verifies OTPs and creates the User in the database.
 * Passwords are hashed before being saved.
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, emailOtp, phoneOtp } = req.body;
    if(!email || !emailOtp || !phoneOtp){
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ success: false, message: "OTP session not found or expired" });
    }

    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (record.emailOtp !== emailOtp) {
      return res.status(400).json({ success: false, message: "Invalid Email OTP" });
    }

    if (record.phoneOtp !== phoneOtp) {
      return res.status(400).json({ success: false, message: "Invalid Phone OTP" });
    }

    // ✅ hash password now
    const hashedPassword = await bcrypt.hash(record.password, 10);

    // ✅ create user
    const newUser = new User({
      username: record.username,
      email: record.email,
      phone: record.phone,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    // ✅ remove from memory
    otpStore.delete(email);

    res.status(201).json({
      success: true,
      message: "User registered successfully, please login",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Logs in a user, verifies password, and returns a JWT token.
 * Uses JWT_SECRET from environment variables.
 */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Compare password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const GetUserById = async (req, res) => {
  try {
    const { id } = req.params; // URL se user id lo

    // Step 1: Find user by ID
    const user = await User.findById(id).select("-password"); // password field hide kar diya

    // Step 2: If user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 3: Send user data
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "null" || id === "undefined") {
      return res.status(400).json({ success: false, message: "Valid user ID required" });
    }

    const { username, email, phone, address, dateOfBirth } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // ⭐ VERY IMPORTANT: DOB update fix
    if (dateOfBirth) {
      const formattedDOB = new Date(dateOfBirth);

      if (isNaN(formattedDOB.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date format" });
      }

      user.dateOfBirth = formattedDOB;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};