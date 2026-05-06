import express from 'express';
import { signup, verifyOtp, userLogin, allUsers, GetUserById, UpdateProfile, forgotPassword, verifyForgotPasswordOtp, resetPassword } from '../controllers/userauthController.js';
import { signupSchema, loginSchema, validateBody } from '../validators/authValidator.js';
import { loginLimiter, otpLimiter, signupLimiter } from '../middlewares/rateLimiter.js';
import { verifyAdmin } from '../middlewares/authVerify.js';

const router = express.Router();


router.get("/",verifyAdmin,allUsers);
/**
 * @route   POST /api/userauth/signup
 * @desc    Signup a new user (OTP will be sent)
 * @access  Public
 */
router.post("/signup",signupLimiter, validateBody(signupSchema), signup);

/**
 * @route   POST /api/userauth/verify-otp
 * @desc    Verify OTP and complete registration
 * @access  Public
 */
router.post('/verify-otp', otpLimiter, verifyOtp);

/**
 * @route   POST /api/userauth/login
 * @desc    Login user and get token
 * @access  Public
 */
// router.post("/login", loginLimiter, validateBody(loginSchema), userLogin);
router.post("/login", validateBody(loginSchema), userLogin);

router.get("/profile/:id", GetUserById);

router.put("/update-profile/:id", UpdateProfile);

/**
 * @route   POST /api/userauth/forgot-password
 * @desc    Initiate password recovery
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/userauth/verify-forgot-password-otp
 * @desc    Verify OTP for password recovery
 */
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);

/**
 * @route   POST /api/userauth/reset-password
 * @desc    Reset password
 */
router.post("/reset-password", resetPassword);

export default router;
