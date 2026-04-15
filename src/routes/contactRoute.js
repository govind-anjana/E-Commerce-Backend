import express from 'express';
import { createContact, getContactPageData, getContacts, updateContactStatus } from '../controllers/contactController.js';
import { verifyAdmin } from '../middlewares/authVerify.js';



const router=express.Router();

// Get contact page data (public)
router.get("/data", getContactPageData);

// Get all contacts (admin or sub-admin with contacts.view permission)
router.get("/",verifyAdmin , getContacts);

// Create new contact (public)
router.post("/", createContact);

// Update contact status (admin or sub-admin with contacts.manage permission)
router.patch("/:id",verifyAdmin , updateContactStatus);

export default router