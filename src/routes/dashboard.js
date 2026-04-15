import express from "express";
import { dashboardData } from "../controllers/dashboardController.js";
const router = express.Router();

router.get("/",dashboardData)
export default router