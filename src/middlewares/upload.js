// middlewares/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ─── File filter: only allow images ──────────────────────────
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WebP are allowed."), false);
  }
};

// ─── Cloudinary Storage: Products ────────────────────────────
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
  },
});

// ─── Cloudinary Storage: Subcategories ───────────────────────
const subcategoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "subcategories",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
  },
});

// ─── Multer instances ─────────────────────────────────────────

/** For product images (multiple files, field name: "img") */
export const uploadProductImages = multer({
  storage: productStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: imageFileFilter,
});

/** For subcategory single image (field name: "img") */
export const uploadSubcategoryImage = multer({
  storage: subcategoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter,
});

// Default export
export default uploadProductImages;