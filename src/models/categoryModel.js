// models/categoryModel.js

import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true, unique:true,lowercase:true },
}, { timestamps: true });

const CategoryModel = mongoose.model("Category", CategorySchema);
export default CategoryModel;
