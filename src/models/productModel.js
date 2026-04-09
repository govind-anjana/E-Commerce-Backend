// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: { type: Number, default: 1, min: 0 },
   originalPrice: { type: Number, default: 0},
   rating: { type: Number, default: 0 },  
    sizes: {
  type: [
    {
      size: { type: String },
      stock: { type: Number, default: 0 }
    }
  ],
  default: null
},
     productDetails: { type: String },
    productDescription: { type: String },
  img: [{ type: String }],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);