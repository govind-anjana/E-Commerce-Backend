// controllers/categoryController.js
import mongoose from "mongoose";
import CategoryModel from "../models/categoryModel.js";

/**
 * GET /api/categories
 * Fetch all categories
 */
export const Getcategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    console.error("Getcategory Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
      error: err.message,
    });
  }
};

/**
 * GET /api/categories/:id
 * Get a single category by ID
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID format" });
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category found",
      data: category,
    });
  } catch (err) {
    console.error("getCategoryById Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
      error: err.message,
    });
  }
};

/**
 * POST /api/categories
 * Create a new category.
 * Middleware: verifyAdmin → validateBody(categorySchema)
 */
export const CategoryAdd = async (req, res) => {
  try {
    const { category } = req.body;
    const categoryName = typeof category === "string" ? category.trim() : "";

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Duplicate check (schema has unique: true but give a friendly message)
    const exists = await CategoryModel.findOne({
      category: categoryName.toLowerCase(),
    });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new CategoryModel({ category: categoryName });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (err) {
    console.error("CategoryAdd Error:", err);

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while adding category",
      error: err.message,
    });
  }
};

/**
 * PUT /api/categories/:id
 * Update a category name.
 * Middleware: verifyAdmin → validateBody(categorySchema)
 */
export const CategoryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const categoryName = typeof category === "string" ? category.trim() : "";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID format" });
    }

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await CategoryModel.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const duplicate = await CategoryModel.findOne({
      category: categoryName.toLowerCase(),
      _id: { $ne: existing._id },
    });
    if (duplicate) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }

    existing.category = categoryName;
    const updated = await existing.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("CategoryUpdate Error:", err);

    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating category",
      error: err.message,
    });
  }
};

/**
 * DELETE /api/categories/:id
 * Delete a category by ID.
 * Middleware: verifyAdmin
 */
export const CategoryDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID format" });
    }

    const deleted = await CategoryModel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("CategoryDelete Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
      error: err.message,
    });
  }
};
