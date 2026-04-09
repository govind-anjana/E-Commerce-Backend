// routes/subcategoryRoute.js
import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subcategoryController.js";
import { uploadSubcategoryImage } from "../middlewares/upload.js";
import { verifyAdmin } from "../middlewares/authVerify.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";
import {
  validateBody,
  createSubCategorySchema,
  updateSubCategorySchema,
} from "../validators/subcategoryValidator.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────

/** GET /api/subcategories */
router.get("/", getSubCategories);

/** GET /api/subcategories/:id */
router.get("/:id", getSubCategoryById);

// ─── Admin Protected Routes ───────────────────────────────────

/**
 * POST /api/subcategories
 * 1. verifyAdmin              → check JWT
 * 2. upload.single("img")     → upload image to Cloudinary
 * 3. multerErrorHandler       → catch multer-specific errors
 * 4. validateBody             → Joi schema validation
 * 5. createSubCategory        → controller
 */
router.post(
  "/",
  verifyAdmin,
  uploadSubcategoryImage.single("img"),
  multerErrorHandler,
  validateBody(createSubCategorySchema),
  createSubCategory
);

/**
 * PUT /api/subcategories/:id
 * 1. verifyAdmin              → check JWT
 * 2. upload.single("img")     → upload new image (optional)
 * 3. multerErrorHandler       → catch multer-specific errors
 * 4. validateBody             → Joi schema validation (all optional)
 * 5. updateSubCategory        → controller
 */
router.put(
  "/:id",
  verifyAdmin,
  uploadSubcategoryImage.single("img"),
  multerErrorHandler,
  validateBody(updateSubCategorySchema),
  updateSubCategory
);

/**
 * DELETE /api/subcategories/:id
 * 1. verifyAdmin      → check JWT
 * 2. deleteSubCategory → controller
 */
router.delete("/:id", verifyAdmin, deleteSubCategory);

export default router;