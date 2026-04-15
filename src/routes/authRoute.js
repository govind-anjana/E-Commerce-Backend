import express from "express";
const router = express.Router();
import { signupAdmin, loginAdmin } from "../controllers/authController.js";
import { signupSchema, adminloginSchema, validateBody, adminsignupSchema } from "../validators/authValidator.js";

/**
 * @route POST /api/admin/signup
 * @desc Admin signup
 * @access Public (usually restricted in production)
 */
router.post("/signup", validateBody(adminsignupSchema), signupAdmin);

/**
 * @route POST /api/admin/login
 * @desc Admin login
 * @access Public
 */
router.post("/login", validateBody(adminloginSchema), loginAdmin);

export default router;
