import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow guest orders if necessary, but usually linked to User
    },
    // Denormalized customer info for easy access
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        image: { type: String },
      },
    ],

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Card", "UPI"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },

    shipment: {
      trackingNumber: { type: String, default: "" },
      courier: { type: String, default: "" },
      estimatedDelivery: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
