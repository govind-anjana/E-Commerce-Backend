// validators/categoryValidator.js
import Joi from "joi";
import { validateBody } from "./productValidator.js";

// ─── Joi Schemas ──────────────────────────────────────────────

export const createCategorySchema = Joi.object({
  category: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must be less than 100 characters",
    "any.required": "Category name is required",
  }),
});

export const updateCategorySchema = Joi.object({
  category: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must be less than 100 characters",
    "any.required": "Category name is required",
  }),
});

// Re-export validateBody so routes only need one import
export { validateBody };
