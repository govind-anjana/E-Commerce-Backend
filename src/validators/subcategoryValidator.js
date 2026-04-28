// validators/subcategoryValidator.js
import Joi from "joi";
import { validateBody } from "./productValidator.js";

// ─── Joi Schemas ──────────────────────────────────────────────

export const createSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.base": "Subcategory name must be a string",
    "string.empty": "Subcategory name is required",
    "string.min": "Subcategory name must be at least 2 characters",
    "string.max": "Subcategory name must be less than 100 characters",
    "any.required": "Subcategory name is required",
  }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "Category is required",
      "string.pattern.base": "Category must be a valid ID",
      "any.required": "Category is required",
    }),
});

export const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.base": "Subcategory name must be a string",
    "string.min": "Subcategory name must be at least 2 characters",
    "string.max": "Subcategory name must be less than 100 characters",
  }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Category must be a valid ID",
    }),
});

// Re-export validateBody so routes only need one import
export { validateBody };
