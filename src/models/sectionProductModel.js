// models/ProductModel.js
import mongoose from "mongoose";

const SectionProSchema = new mongoose.Schema({
  
 section: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming you already have a Product model
    },
  ],
  
}, { timestamps: true });

const SectionProModel = mongoose.model("SectionProduct", SectionProSchema);
export default SectionProModel;
