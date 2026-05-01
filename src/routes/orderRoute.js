import express from "express";
import { 
  getAllOrders, 
  getUserOrders, 
  createOrder, 
  updateOrderStatus, 
  updateShipmentDetails,
  deleteOrder,
  cancelOrder
} from "../controllers/orderController.js";
import { verifyAdmin } from "../middlewares/authVerify.js";

const router = express.Router();

// User routes
router.patch("/:id/cancel", cancelOrder);
router.get("/user", getUserOrders);
router.post("/", createOrder);

// Admin routes (Protected by verifyAdmin)
router.get("/", verifyAdmin, getAllOrders);
router.patch("/:id/status", verifyAdmin, updateOrderStatus);
router.patch("/:id/shipment", verifyAdmin, updateShipmentDetails);
router.delete("/:id", verifyAdmin, deleteOrder);

export default router;
