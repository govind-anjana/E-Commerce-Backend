import express from 'express';



import { uploadSubcategoryImage } from '../middlewares/upload.js';
import { verifyAdmin } from '../middlewares/authVerify.js';
import { BannerAdd, BannerAll, BannerDelete, BannerUpdate } from '../controllers/bannerController.js';

const router=express.Router();
// Get all banners
router.get("/", BannerAll);

// Add a banner
router.post("/",verifyAdmin, uploadSubcategoryImage.single("img"), BannerAdd);

// Update a banner by ID (Admin only)
router.put("/:id", verifyAdmin,  uploadSubcategoryImage.single("img") , BannerUpdate);

// Delete a banner by ID (Admin only)
router.delete("/:id", verifyAdmin, BannerDelete);

export default router;