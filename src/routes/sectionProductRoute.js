import express from "express";
import {GetSectionProduct, AddSectionPro, GetProductsBySection, RemoveProductFromSection, SectionProductReplace } from "../controllers/sectionProductController.js";
import { verifyAdmin } from '../middlewares/authVerify.js'

const router=express.Router();

// Get a section product
router.get("/",GetSectionProduct)

// Get a section product by Find 
router.get("/:section", GetProductsBySection);

// Add a section product (Admin Only)
router.post("/",verifyAdmin,AddSectionPro);

// Replace product to section product (Admin Only)
router.post("/replace-product",verifyAdmin,SectionProductReplace);

// Product remove to section product (Admin Only)
router.post("/product-remove",verifyAdmin, RemoveProductFromSection);

export default router;