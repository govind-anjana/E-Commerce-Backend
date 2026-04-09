// models/SubCategory.js
import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

 img: {
      type: String,
      required: true, // Cloudinary image URL is required
    },
}, { timestamps: true });

export default mongoose.model("SubCategory", subCategorySchema);