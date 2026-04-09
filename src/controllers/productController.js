// controllers/productController.js
import mongoose from "mongoose";
import Product from "../models/productModel.js";

/**
 * GET /api/products
 * Fetch all products with populated category & subCategory
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "category")
      .populate("subCategory", "name img");

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      count: products.length,
      data: products,
    });
  } catch (err) {
    console.error("getProducts Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: err.message,
    });
  }
};

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id)
      .populate("category", "category")
      .populate("subCategory", "name img");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product found",
      data: product,
    });
  } catch (err) {
    console.error("getProductById Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
      error: err.message,
    });
  }
};

/**
 * POST /api/products
 * Create a new product.
 * Middleware before this: verifyAdmin → upload → multerErrorHandler → requireImages → validateBody
 * req.files already validated and uploaded to Cloudinary by the time we reach here.
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      originalPrice,
      rating,
      productDetails,
      productDescription,
      category,
      subCategory,
      sizes
    } = req.body;

    let parsedSizes = null;

if (sizes && sizes !== "null") {
  parsedSizes = typeof sizes === "string"
    ? JSON.parse(sizes)
    : sizes;

  // validate
  parsedSizes = parsedSizes.map((item) => ({
    size: item.size,
    stock: Number(item.stock) || 0
  }));

  // agar empty array aaya to bhi null kar do
  if (parsedSizes.length === 0) {
    parsedSizes = null;
  }
}
    // ✅ Parse sizes (important for form-data)
    // let parsedSizes = [];
    // if (sizes) {
    //   parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    // }

    // // ✅ Validate sizes
    // parsedSizes = parsedSizes.map((item) => ({
    //   size: item.size,
    //   stock: Number(item.stock) || 0
    // }));

    // ✅ Image URLs (Cloudinary)
    const imageUrls = req.files?.map(
      (file) => file.path || file.secure_url
    ) || [];

    const newProduct = new Product({
      name: name.trim(),
      price: Number(price),
      quantity: Number(quantity),
      originalPrice: Number(originalPrice),
      rating: Number(rating),
      productDetails: productDetails?.trim() || "",
      productDescription: productDescription?.trim() || "",
      category,
      subCategory,
      sizes: parsedSizes, 
      img: imageUrls
    });

    await newProduct.save();

    const populated = await Product.findById(newProduct._id)
      .populate("category", "category")
      .populate("subCategory", "name img");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: populated
    });

  } catch (err) {
    console.error("createProduct Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * PUT /api/products/:id
 * Update a product.
 * Middleware before this: verifyAdmin → upload → multerErrorHandler → validateBody
 * Supports partial updates. Image handling:
 *   - existingImages: JSON array of current image URLs to keep
 *   - removedImages:  JSON array of URLs to remove
 *   - req.files:      newly uploaded images (appended)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name, price, description,
      category, subCategory,
      existingImages, removedImages,
    } = req.body;

    // ─── Image Merge Logic ───────────────────────────────────
    // 1. Parse what the frontend says should be kept
    let currentImages = product.img || [];
    if (existingImages) {
      try {
        currentImages =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
        if (!Array.isArray(currentImages)) currentImages = product.img || [];
      } catch {
        currentImages = product.img || [];
      }
    }

    // 2. Parse images to remove
    let removedArr = [];
    if (removedImages) {
      try {
        removedArr =
          typeof removedImages === "string"
            ? JSON.parse(removedImages)
            : removedImages;
        if (!Array.isArray(removedArr)) removedArr = [];
      } catch {
        removedArr = [];
      }
    }

    // 3. Filter out removed, append new uploads
    const keptImages = currentImages.filter((img) => !removedArr.includes(img));
    const newUploads = req.files
      ? req.files.map((f) => f.path || f.secure_url).filter(Boolean)
      : [];
    const finalImages = [...keptImages, ...newUploads];

    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // ─── Build update payload ───────────────────────────────
    const updateData = { img: finalImages };
    if (name !== undefined)        updateData.name        = name.trim();
    if (price !== undefined)       updateData.price       = parseFloat(price);
    if (description !== undefined) updateData.description = description?.trim() || "";
    if (category !== undefined)    updateData.category    = category;
    if (subCategory !== undefined) updateData.subCategory = subCategory;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category", "category")
      .populate("subCategory", "name img");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("updateProduct Error:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: err.message,
    });
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product by ID
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("deleteProduct Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
      error: err.message,
    });
  }
};