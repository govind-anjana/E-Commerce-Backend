// routes/categoryRoute.js
import express from "express";
import {
  Getcategory,
  getCategoryById,
  CategoryAdd,
  CategoryUpdate,
  CategoryDelete,
} from "../controllers/categoryController.js";
import { verifyAdmin } from "../middlewares/authVerify.js";
import {
  validateBody,
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categoryValidator.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────

/** GET /api/categories */
router.get("/", Getcategory);

/** GET /api/categories/:id */
router.get("/:id", getCategoryById);

// ─── Admin Protected Routes ───────────────────────────────────

/**
 * POST /api/categories
 * 1. verifyAdmin         → check JWT
 * 2. validateBody        → Joi schema (category required, min 2 chars)
 * 3. CategoryAdd         → controller (also checks duplicate)
 */
router.post("/", verifyAdmin, validateBody(createCategorySchema), CategoryAdd);

/**
 * PUT /api/categories/:id
 * 1. verifyAdmin         → check JWT
 * 2. validateBody        → Joi schema (name required)
 * 3. CategoryUpdate      → controller
 */
router.put(
  "/:id",
  verifyAdmin,
  validateBody(updateCategorySchema),
  CategoryUpdate,
);

/**
 * DELETE /api/categories/:id
 * 1. verifyAdmin    → check JWT
 * 2. CategoryDelete → controller
 */
router.delete("/:id", verifyAdmin, CategoryDelete);

export default router;
