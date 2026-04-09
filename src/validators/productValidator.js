// validators/productValidator.js
import Joi from "joi";

// ─── Joi Schemas ──────────────────────────────────────────────

/**
 * Schema for creating a new product.
 * Images are validated separately (via req.files).
 */
export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name cannot be empty",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name must be less than 200 characters",
  }),

  price: Joi.number().positive().messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be greater than 0",
  }),

  quantity: Joi.number().min(0).messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
  }),

  originalPrice: Joi.number().min(0).allow(null).messages({
    "number.base": "Original price must be a number",
  }),

  rating: Joi.number().min(0).max(5).allow(null).messages({
    "number.base": "Rating must be a number",
    "number.max": "Rating cannot be more than 5",
  }),

  productDetails: Joi.string().allow("", null).messages({
    "string.base": "Product details must be a string",
  }),

  productDescription: Joi.string().allow("", null).messages({
    "string.base": "Product description must be a string",
  }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Category must be a valid ID",
    }),

  subCategory: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "SubCategory must be a valid ID",
    }),

  // ✅ sizes support (important)


}).min(1); // 🔥 at least 1 field required
/**
 * Schema for updating an existing product.
 * All fields are optional — only provided fields are validated.
 */
export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).optional().messages({
    "string.base": "Product name must be a string",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name must be less than 200 characters",
  }),

  price: Joi.number().positive().optional().messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be greater than 0",
  }),

  description: Joi.string().max(2000).allow("", null).optional().messages({
    "string.max": "Description must be less than 2000 characters",
  }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Category must be a valid ID",
    }),

  subCategory: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "SubCategory must be a valid ID",
    }),

  // These come from FormData as JSON strings — Joi validates them as strings
  existingImages: Joi.string().optional().allow("", null),
  removedImages: Joi.string().optional().allow("", null),
});


// ─── Middleware Factories ──────────────────────────────────────

/**
 * Validates req.body against a Joi schema.
 * Returns 400 with all validation errors if validation fails.
 */
export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }
  next();
};

/**
 * Validates that at least one image was uploaded via Cloudinary/Multer.
 * Use on routes that require image uploads (POST create).
 */
export const requireImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one product image is required",
    });
  }
  next();
};
