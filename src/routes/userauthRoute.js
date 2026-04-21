import express from 'express';
import { signup, verifyOtp, userLogin, allUsers, GetUserById, UpdateProfile } from '../controllers/userauthController.js';
import { signupSchema, loginSchema, validateBody } from '../validators/authValidator.js';
import { loginLimiter, otpLimiter, signupLimiter } from '../middlewares/rateLimiter.js';
import { verifyAdmin } from '../middlewares/authVerify.js';

const router = express.Router();


router.get("/",verifyAdmin,allUsers);
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
// router.post("/login", loginLimiter, validateBody(loginSchema), userLogin);
router.post("/login", validateBody(loginSchema), userLogin);

router.get("/profile/:id", GetUserById);

router.put("/update-profile/:id", UpdateProfile);

export default router;
