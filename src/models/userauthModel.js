import mongoose from "mongoose";
/**
 * User Model for Authentication.
 * 
 * Fields:
 * - username: String (Required for profile)
 * - email: String (Unique, used for login/identification)
 * - password: String (Stored as a Bcrypt hash for security)
 * - phone: String (Used for verification and contact)
 * - isVerified: Boolean (True if email/phone OTP verification is complete)
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Stored as Bcrypt Hash
  phone:    { type: String, default: "" },
  dateOfBirth:{
    type: Date,           // <-- important: store DOB as Date
    required: false       // make true if you want to make it mandatory
  },
  address:  { type: String, default: "" },
  isVerified: { type: Boolean, default: false },            
  otpExpiresAt: { type: Date },  
  verificationToken: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

