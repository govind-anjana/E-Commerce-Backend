// controllers/bannerController.js
import mongoose from "mongoose";
import BannerModel from "../models/bannerModel.js";
import ProductModel from "../models/productModel.js";
// import cloudinary from "../config/cloudinary.js"; // optional

/**
 * @controller BannerAdd
 * @desc Upload a new promotional banner (Admin Only)
 * @route POST /api/banners
 * @access Private/Admin
 * @requires multipart/form-data
 */
export const BannerAdd = async (req, res) => {
  try {
    const { productId, heading, title, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const imageUrl = req.file.path || req.file.secure_url;

    //  convert isActive
    let isActiveBool = true;
    if (typeof isActive === "string") {
      isActiveBool = isActive.toLowerCase() === "true";
    } else if (typeof isActive === "boolean") {
      isActiveBool = isActive;
    }

    let newBannerData = {
      img: imageUrl,
      isActive: isActiveBool,
      heading: heading?.trim() || "",
      title: title?.trim() || "",
    };

    //  product validation
    if (productId) {
      const productExists = await ProductModel.findById(productId);
      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found with given ID",
        });
      }
      newBannerData.productId = productId;
    }

    const newBanner = await BannerModel.create(newBannerData);

    res.status(201).json({
      success: true,
      message: "Banner uploaded successfully!",
      data: newBanner,
    });

  } catch (err) {
    console.error("Banner Add Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * @controller BannerAll
 * @desc Retrieve all promotional banners with linked product details
 * @route GET /api/banners
 * @access Public
 */
export const BannerAll = async (req, res) => {
  try {
    const banners = await BannerModel.find()
      .populate("productId", "name price img");

    res.status(200).json({
      success: true,
      message: "All banners retrieved",
      data: banners,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * @controller BannerUpdate
 * @desc Update banner details or image by ID (Admin Only)
 * @route PUT /api/banners/:id
 * @access Private/Admin
 * @requires multipart/form-data
 */
export const BannerUpdate = async (req, res) => {
  try {
    const { productId, heading, title, isActive } = req.body;
    const bannerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid Banner ID",
  });
}
    const banner = await BannerModel.findById(bannerId);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    //  product update
    if (productId !== undefined) {
      if (productId === "" || productId === "null") {
        banner.productId = null;
      } else {
        const productExists = await ProductModel.findById(productId);
        if (!productExists) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }
        banner.productId = productId;
      }
    }

    //  image replace
    if (req.file) {
      //  optional: delete old image from cloudinary
      /*
      if (banner.img) {
        const publicId = banner.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`your_folder/${publicId}`);
      }
      */

      banner.img = req.file.path || req.file.secure_url;
    }

    //  heading
    if (heading !== undefined) {
      banner.heading = heading?.trim() || "";
    }

    //  title
    if (title !== undefined) {
      banner.title = title?.trim() || "";
    }

    //  isActive
    if (isActive !== undefined) {
      if (typeof isActive === "string") {
        banner.isActive = isActive.toLowerCase() === "true";
      } else {
        banner.isActive = Boolean(isActive);
      }
    }

    const updatedBanner = await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully!",
      data: updatedBanner,
    });

  } catch (err) {
    console.error("Banner Update Error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating banner",
      error: err.message,
    });
  }
};

/**
 * @controller BannerDelete
 * @desc Delete a banner by ID (Admin Only)
 * @route DELETE /api/banners/:id
 * @access Private/Admin
 */
export const BannerDelete = async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    //  optional: delete image from cloudinary
    /*
    if (banner.img) {
      const publicId = banner.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`your_folder/${publicId}`);
    }
    */

    await BannerModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });

  } catch (err) {
    console.error("Banner Delete Error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting banner",
      error: err.message,
    });
  }
};