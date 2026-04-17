import PromoCodeModel from "../models/promoModel.js";
import ProductModel from "../models/productModel.js";

/* =========================
   Get All Promo Codes
========================= */
export const PromoShow = async (req, res) => {
  try {
    const promo = await PromoCodeModel.find()
      .populate("applicableSubCategory", "name")
      .populate("applicableProduct", "name");
    res.status(200).json({ success: true, message: "All promo codes retrieved", promo });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/* =========================
   Create Promo Code
========================= */
export const PromoCreate = async (req, res) => {
  try {
    let {
      code,
      discountValue,
      startDate,
      expiryDate,
      usageLimit,
      applicableSubCategory,
      applicableProduct,
    } = req.body;

    if (!code || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Code, discountValue, and expiryDate are required",
      });
    }

    // Normalize code
    code = code.trim().toUpperCase();

    const existingPromo = await PromoCodeModel.findOne({ code });
    if (existingPromo) {
      return res.status(400).json({
        success: false,
        message: "Promo code already exists",
      });
    }

    // Dates
    const start = startDate ? new Date(startDate) : new Date();
    const expiry = new Date(expiryDate);

    if (isNaN(start.getTime()) || isNaN(expiry.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    if (expiry < start) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be >= start date",
      });
    }

    if (expiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    // Discount
    const discount = Number(discountValue);
    if (isNaN(discount) || discount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount must be > 0",
      });
    }

    // Usage limit
    const limit = usageLimit !== undefined ? Number(usageLimit) : null;
    if (limit !== null && limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Usage limit must be > 0",
      });
    }

    // Category/Product conflict
    if (applicableSubCategory && applicableProduct) {
      return res.status(400).json({
        success: false,
        message: "Promo can be applied to either sub-category or product, not both",
      });
    }

    const promo = new PromoCodeModel({
      code,
      discountValue: discount,
      startDate: start,
      expiryDate: expiry,
      usageLimit: limit,
      applicableSubCategory: applicableSubCategory || null,
      applicableProduct: applicableProduct || null,
    });

    await promo.save();

    return res.status(201).json({
      success: true,
      message: "Promo created successfully",
      promo,
    });
  } catch (error) {
    console.error("Create Promo Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* =========================
   Apply Promo Code
========================= */
export const applyPromo = async (req, res) => {
  try {
    const { code, productId, subCategoryId, userEmail, totalAmount } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Promo code required" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Valid total amount required" });
    }

    // Normalize code
    const promo = await PromoCodeModel.findOne({
      code: code.trim().toUpperCase(),
    });

    if (!promo || !promo.isActive) {
      return res.status(400).json({ message: "Invalid promo code" });
    }

    // Expiry check
    if (new Date() > promo.expiryDate) {
      return res.status(400).json({ message: "Promo expired" });
    }

    // Usage limit
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ message: "Usage limit reached" });
    }

    // Already used
    if (promo.usedBy.includes(userEmail)) {
      return res.status(400).json({ message: "You already used this promo" });
    }

    // Product match
    if (promo.applicableProduct) {
      if (promo.applicableProduct.toString() !== productId) {
        return res.status(400).json({ message: "Promo not valid for this product" });
      }
    }

    // SubCategory match
    if (promo.applicableSubCategory) {
      if (promo.applicableSubCategory.toString() !== subCategoryId) {
        return res.status(400).json({ message: "Promo not valid for this subcategory" });
      }
    }

    // ==========================
    // 🔥 FLAT DISCOUNT LOGIC
    // ==========================

    let discount = Number(promo.discountValue) || 0;

    // Safety: discount > totalAmount na ho
    if (discount > totalAmount) {
      discount = totalAmount;
    }

    const finalAmount = totalAmount - discount;

    // Save usage
    promo.usedCount += 1;
    promo.usedBy.push(userEmail);
    await promo.save();

    return res.json({
      success: true,
      message: `₹${discount} OFF applied`,
      originalAmount: totalAmount,
      discount,
      finalAmount,
    });

  } catch (error) {
    console.error("Apply Promo Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


  //  Update Promo

export const PromoUpdate = async (req, res) => {
  try {
    const {
      code,
      discountValue,
      usageLimit,
      startDate,
      expiryDate,
      applicableSubCategory,
      applicableProduct
    } = req.body;

    if (
      !code &&
      !discountValue &&
      !usageLimit &&
      !startDate &&
      !expiryDate &&
      applicableSubCategory === undefined &&
      applicableProduct === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "At least one field is required to update" });
    }

    const updateData = {};

    if (code !== undefined) updateData.code = code;
    if (discountValue !== undefined) updateData.discountValue = discountValue;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (expiryDate !== undefined) updateData.expiryDate = new Date(expiryDate);

    
    if (applicableSubCategory !== undefined) {
      // If subcategory is empty string or null → set null
      updateData.applicableSubCategory = applicableSubCategory || null;

      // If subcategory is provided (not null/empty) → product must become null
      if (applicableSubCategory) {
        updateData.applicableProduct = null;
      }
    }

    //  User updates Product
    if (applicableProduct !== undefined) {
      // If product is empty string or null → set null
      updateData.applicableProduct = applicableProduct || null;

      // If product is provided → subcategory must become null
      if (applicableProduct) {
        updateData.applicableSubCategory = null;
      }
    }

    const updatedPromo = await PromoCodeModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPromo)
      return res.status(404).json({ success: false, message: "Promo not found" });

    res.status(200).json({
      success: true,
      message: "Promo updated successfully",
      promo: updatedPromo,
    });

  } catch (err) {
    console.error("Promo update error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};


/* =========================
   Delete Promo
========================= */
export const PromoDelete = async (req, res) => {
  try {
    const deleted = await PromoCodeModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Promo not found" });

    res.status(200).json({ success: true, message: "Promo deleted successfully" });
  } catch (err) {
    console.error("Promo delete error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
