// routes/productRoute.js
import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySubCategory,
  getFilteredProducts,
} from "../controllers/productController.js";
import { uploadProductImages } from "../middlewares/upload.js";
import { verifyAdmin } from "../middlewares/authVerify.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";
import {
  validateBody,
  requireImages,
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────

/** GET /api/products - All products */
router.get("/", getProducts);
 

// ─── Admin Protected Routes ───────────────────────────────────

/**
 * POST /api/products
 * 1. verifyAdmin   → check JWT
 * 2. upload.array  → upload images to Cloudinary
 * 3. multerError   → catch multer-specific upload errors
 * 4. requireImages → ensure at least one image was uploaded
 * 5. validateBody  → Joi schema validation on req.body
 * 6. createProduct → controller
 */
router.post(
  "/",
  verifyAdmin,
  uploadProductImages.array("img", 4),
  multerErrorHandler,
  validateBody(createProductSchema),
  requireImages,
  createProduct
);

/**
 * PUT /api/products/:id
 * 1. verifyAdmin   → check JWT
 * 2. upload.array  → upload new images to Cloudinary (optional)
 * 3. multerError   → catch multer-specific upload errors
 * 4. validateBody  → Joi schema validation on req.body (all fields optional)
 * 5. updateProduct → controller
 */
router.put(
  "/:id",
  verifyAdmin,
  uploadProductImages.array("img", 4),
  multerErrorHandler,
  validateBody(updateProductSchema),
  updateProduct
);

/**
 * DELETE /api/products/:id
 * 1. verifyAdmin   → check JWT
 * 2. deleteProduct → controller
 */
router.delete("/:id", verifyAdmin, deleteProduct);


router.get("/subcategory", getProductsBySubCategory);

//  Category + SubCategory filter
router.get("/products/filter", getFilteredProducts);

/** GET /api/products/:id - Single product */
router.get("/:id", getProductById);

export default router;