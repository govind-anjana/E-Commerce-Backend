// middlewares/multerErrorHandler.js

import multer from "multer";

/**
 * Catches Multer errors (file size, file count, file type)
 * and returns a clean JSON error response instead of crashing.
 *
 * Usage: place AFTER upload.array() or upload.single() in route.
 * e.g. router.post("/", upload.array("img", 10), multerErrorHandler, controller)
 */
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 50MB per file",
        });

      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files. Maximum 10 images allowed",
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: `Unexpected field: ${err.field}. Use 'img' as the field name`,
        });

      case "LIMIT_FIELD_VALUE":
        return res.status(400).json({
          success: false,
          message: "Field value too large. Maximum is 10MB",
        });

      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
    }
  }

  // Not a multer error — pass it along
  next(err);
};

export default multerErrorHandler;
