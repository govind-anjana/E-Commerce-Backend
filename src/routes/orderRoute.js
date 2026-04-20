import express from "express";
import { 
  getAllOrders, 
  getUserOrders, 
  createOrder, 
  updateOrderStatus, 
  updateShipmentDetails,
  deleteOrder
} from "../controllers/orderController.js";
import { verifyAdmin } from "../middlewares/authVerify.js";

const router = express.Router();

// User routes (might need user auth middleware later, for now keeping minimal)
router.get("/user", getUserOrders);
router.post("/", createOrder);

// Admin routes (Protected by verifyAdmin)
router.get("/", verifyAdmin, getAllOrders);
router.patch("/:id/status", verifyAdmin, updateOrderStatus);
router.patch("/:id/shipment", verifyAdmin, updateShipmentDetails);
router.delete("/:id", verifyAdmin, deleteOrder);

export default router;
