import rateLimit from "express-rate-limit";

// ─────────────────────────────────────────
//  OTP LIMITER (send + verify OTP)
// ─────────────────────────────────────────
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 3, // max 3 attempts
  message: {
    success: false,
    message: "Too many OTP requests. Try again after 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────
//  SIGNUP LIMITER
// ─────────────────────────────────────────
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: "Too many signup attempts. Try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────
//  LOGIN LIMITER
// ─────────────────────────────────────────
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────
//  RESET OTP LIMITER
// ─────────────────────────────────────────
export const resetOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many reset OTP requests. Try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});