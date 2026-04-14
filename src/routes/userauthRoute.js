import express from 'express';
import { signup, verifyOtp, userLogin } from '../controllers/userauthController.js';
import { signupSchema, loginSchema, validateBody } from '../validators/authValidator.js';
import { loginLimiter, otpLimiter, signupLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/user/signup
 * @desc    Signup a new user (OTP will be sent)
 * @access  Public
 */
router.post("/signup",signupLimiter, validateBody(signupSchema), signup);

/**
 * @route   POST /api/user/verify-otp
 * @desc    Verify OTP and complete registration
 * @access  Public
 */
router.post('/verify-otp', otpLimiter, verifyOtp);

/**
 * @route   POST /api/user/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post("/login", loginLimiter, validateBody(loginSchema), userLogin);

export default router;
