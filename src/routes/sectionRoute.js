import express from "express";
import { GetSection, SectionAdd, SectionDelete, SectionUpdate } from "../controllers/sectionController.js";
import { verifyAdmin } from "../middlewares/authVerify.js";


const router=express.Router();

router.get("/",GetSection);

// Add a section (Admin Only)
router.post("/",verifyAdmin,SectionAdd);

// Update a Setion (Admin Only)
router.put("/:id",verifyAdmin,SectionUpdate);

// Delete a Section (Admin Only)
router.delete("/:id",verifyAdmin,SectionDelete);



export default router;