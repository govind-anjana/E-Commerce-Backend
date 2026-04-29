// controllers/productController.js
import mongoose from "mongoose";
import Product from "../models/productModel.js";



/**
 * @controller getProducts
 * @desc Fetch all products with populated category and subcategory details
 * @route GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find()
      .populate("category", "category")
      .populate("subCategory", "name img")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
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
 * @controller getProductById
 * @desc Get details of a single product by its ID
 * @route GET /api/products/:id
 * @access Public
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
 * @controller createProduct
 * @desc Create a new product with multiple image uploads (Admin Only)
 * @route POST /api/products
 * @access Private/Admin
 * @requires multipart/form-data
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

    //  Image URLs (Cloudinary)
    const imageUrls = req.files?.map(
      (file) => file.path || file.secure_url
    ) || [];
    const newProduct = new Product({
      name: name.trim(),
      price: toNumber(price),
      quantity: toNumber(quantity),
      originalPrice: toNumber(originalPrice),
      rating: toNumber(rating),
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
 * @controller updateProduct
 * @desc Update product details or images by ID (Admin Only)
 * @route PUT /api/products/:id
 * @access Private/Admin
 * @requires multipart/form-data
 */

// ✅ Helper function (FIX for toNumber error)
const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

 export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
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
      name,
      price,
      quantity,
      originalPrice,
      rating,
      productDescription,
      productDetails,
      category,
      subCategory,
      sizes,
    } = req.body;

    // ─────────────────────────────────────────
    // 🖼️ IMAGE LOGIC
    // ─────────────────────────────────────────

    const newUploads = req.files
      ? req.files.map((f) => f.path || f.secure_url).filter(Boolean)
      : [];

    let finalImages = [];
    let isImageUpdated = false;

    if (newUploads.length > 0) {
      // FIX #1: Delete old Cloudinary images before replacing
      if (product.img?.length) {
        await Promise.all(
          product.img.map((url) => {
            // Extract public_id from Cloudinary URL
            // e.g. https://res.cloudinary.com/demo/image/upload/v123/folder/myimage.jpg
            // → public_id = "folder/myimage"
            const parts = url.split("/");
            const uploadIndex = parts.indexOf("upload");
            const publicIdWithExt = parts
              .slice(uploadIndex + 2) // skip "upload" and version segment
              .join("/");
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension
            return cloudinary.uploader.destroy(publicId);
          })
        );
      }

      finalImages = newUploads;
      isImageUpdated = true;
    } else {
      // No new files sent → keep existing images untouched
      finalImages = product.img || [];
    }

    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // ─────────────────────────────────────────
    // BUILD UPDATE DATA
    // ─────────────────────────────────────────

    const updateData = {
      img: finalImages,
    };

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (price !== undefined) {
      const val = toNumber(price);
      if (val !== undefined) updateData.price = val;
    }

    if (quantity !== undefined) {
      const val = toNumber(quantity);
      if (val !== undefined) updateData.quantity = val;
    }

    if (originalPrice !== undefined) {
      const val = toNumber(originalPrice);
      if (val !== undefined) updateData.originalPrice = val;
    }

    if (rating !== undefined) {
      const val = toNumber(rating);
      if (val !== undefined) updateData.rating = val;
    }

    if (productDescription !== undefined) {
      updateData.productDescription = productDescription?.trim() || "";
    }

    if (productDetails !== undefined) {
      updateData.productDetails = productDetails?.trim() || "";
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (subCategory !== undefined) {
      updateData.subCategory = subCategory;
    }

    // ─────────────────────────────────────────
    // SIZES HANDLING
    // ─────────────────────────────────────────

    if (sizes !== undefined) {
      let parsedSizes = null;

      if (sizes && sizes !== "null") {
        try {
          parsedSizes =
            typeof sizes === "string" ? JSON.parse(sizes) : sizes;

          parsedSizes = parsedSizes.map((item) => ({
            size: item.size,
            stock: Number(item.stock) || 0,
          }));

          if (parsedSizes.length === 0) {
            parsedSizes = null;
          }
        } catch (err) {
          console.log("Sizes parse error:", err);
          parsedSizes = null;
        }
      }

      updateData.sizes = parsedSizes;
    }

    // ─────────────────────────────────────────
    // UPDATE OPTIONS
    // ─────────────────────────────────────────

    const updateOptions = {
      new: true,            // FIX #3: Correct Mongoose option (not returnDocument: "after")
      runValidators: true,
      // FIX #2: Removed timestamps:false — not supported in findByIdAndUpdate, does nothing
    };

    // ─────────────────────────────────────────
    // UPDATE PRODUCT
    // ─────────────────────────────────────────

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      updateOptions
    )
      .populate("category", "category")
      .populate("subCategory", "name img");

    return res.status(200).json({
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

    return res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: err.message,
    });
  }
};
/**
 * @controller deleteProduct
 * @desc Delete a product by ID (Admin Only)
 * @route DELETE /api/products/:id
 * @access Private/Admin
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


export const getProductsBySubCategory = async (req, res) => {
  try {
    const { subCategory } = req.query;

    if (!subCategory) {
      return res.status(400).json({
        success: false,
        message: "SubCategory is required",
      });
    }

    const products = await Product.find({
      subCategory: subCategory,
    })
      .populate("category", "category")
      .populate("subCategory", "name img");

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};
export const getFilteredProducts = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    let filter = {};

    //  Agar category diya hai
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      filter.category = category;
    }

    //   Agar subCategory diya hai
    if (subCategory) {
      if (!mongoose.Types.ObjectId.isValid(subCategory)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subCategory ID",
        });
      }
      filter.subCategory = subCategory;
    }

    //  Optional: agar dono nahi aaye to error
    if (!category && !subCategory) {
      return res.status(400).json({
        success: false,
        message: "At least category or subCategory is required",
      });
    }

    //  DB Query
    const products = await Product.find(filter)
      .populate("category", "category")
      .populate("subCategory", "name img")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (err) {
    console.error("getFilteredProducts Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: err.message,
    });
  }
};