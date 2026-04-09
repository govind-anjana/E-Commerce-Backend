import express from "express";
const router = express.Router();
import { signupAdmin, loginAdmin } from "../controllers/authController.js";
import { signupSchema, adminloginSchema, validateBody } from "../validators/authValidator.js";

/**
 * @route POST /api/auth/signup
 * @desc Admin signup
 * @access Public (usually restricted in production)
 */
router.post("/signup", validateBody(signupSchema), signupAdmin);

/**
 * @route POST /api/auth/login
 * @desc Admin login
 * @access Public
 */
router.post("/login", validateBody(adminloginSchema), loginAdmin);

export default router;
