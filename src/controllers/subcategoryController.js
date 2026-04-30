// controllers/subcategoryController.js
import mongoose from "mongoose";
import SubCategory from "../models/subcategoryModel.js";

/**
 * @controller getSubCategories
 * @desc Fetch all subcategories with populated parent category details
 * @route GET /api/subcategories
 * @access Public
 */
export const getSubCategories = async (req, res) => {
  try {
    const subcategories = await (await SubCategory.find().populate("category", "category"));

    res.status(200).json({
      success: true,
      message: "Subcategories retrieved successfully",
      count: subcategories.length,
      data: subcategories.reverse(),
    });
  } catch (err) {
    console.error("getSubCategories Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching subcategories",
      error: err.message,
    });
  }
};

/**
 * @controller getSubCategoryById
 * @desc Get details of a single subcategory by ID
 * @route GET /api/subcategories/:id
 * @access Public
 */
export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid subcategory ID format" });
    }

    const subcategory = await SubCategory.findById(id).populate("category", "category");

    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory found",
      data: subcategory,
    });
  } catch (err) {
    console.error("getSubCategoryById Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching subcategory",
      error: err.message,
    });
  }
};

/**
 * @controller createSubCategory
 * @desc Create a new subcategory with image upload (Admin Only)
 * @route POST /api/subcategories
 * @access Private/Admin
 * @requires multipart/form-data
 */
export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    // Image uploaded by Cloudinary via multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Subcategory image is required",
      });
    }

    const imgUrl = req.file.path || req.file.secure_url;
    console.log(imgUrl);
    if (!imgUrl) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    // Check if subcategory name already exists in same category
    const existing = await SubCategory.findOne({ name: name.trim(), category });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Subcategory with this name already exists in the selected category",
      });
    }

    const newSubCategory = new SubCategory({
      name: name.trim(),
      category,
      img: imgUrl,
    });

    await newSubCategory.save();

    const populated = await SubCategory.findById(newSubCategory._id).populate("category", "category");

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: populated,
    });
  } catch (err) {
    console.error("createSubCategory Error:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation Error", errors: messages });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating subcategory",
      error: err.message,
    });
  }
};

/**
 * @controller updateSubCategory
 * @desc Update subcategory details or image by ID (Admin Only)
 * @route PUT /api/subcategories/:id
 * @access Private/Admin
 * @requires multipart/form-data
 */
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid subcategory ID format" });
    }

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    const { name, category } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (category !== undefined) updateData.category = category;

    // If a new image was uploaded, replace existing
    if (req.file) {
      const imgUrl = req.file.path || req.file.secure_url;
      if (imgUrl) updateData.img = imgUrl;
    }

    const updated = await SubCategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "category");

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("updateSubCategory Error:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation Error", errors: messages });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating subcategory",
      error: err.message,
    });
  }
};

/**
 * @controller deleteSubCategory
 * @desc Delete a subcategory by ID (Admin Only)
 * @route DELETE /api/subcategories/:id
 * @access Private/Admin
 */
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid subcategory ID format" });
    }

    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (err) {
    console.error("deleteSubCategory Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting subcategory",
      error: err.message,
    });
  }
};