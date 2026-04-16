import SectionProModel from "../models/sectionProductModel.js";
import SectionModel from "../models/sectionModel.js";
export const GetProductsBySection = async (req, res) => {
  try {
    const { section } = req.params; // e.g. "comic-style"

    // Find section by name and populate products
    const sectionData = await SectionProModel.findOne({ section })
      .populate("products"); // replace ObjectIds with actual product details

    if (!sectionData) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${section} products fetched successfully`,
      data: sectionData.products, // only return products list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const GetSectionProduct = async (req, res) => {
  try {

    //find are all product
    const products = await SectionProModel.find();
    res.status(200).json({ message: "All Section Product Detail retrieved", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Create Section Controller
 export const AddSectionPro = async (req, res) => {
  try {
    const { section, products } = req.body;

    if (!section || !products) {
      return res.status(400).json({
        success: false,
        message: "Section name and Product ID are required",
      });
    }
const existingSection = await SectionModel.findOne({ section });

    if (!existingSection) {
      return res.status(404).json({
        success: false,
        message: `Section "${section}" not found. Please create it first.`,
      });
    }
    // Update if exists, or create new if not found
    const updatedSection = await SectionProModel.findOneAndUpdate(
      { section },
      { $addToSet: { products } }, // add unique product ID
      { new: true, upsert: true }  //  upsert:true => create new if not exists
    ).populate("products");

    res.status(200).json({
      success: true,
      message: "Product added successfully to section",
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const SectionProductReplace = async (req, res) => {
  try {
    const { sectionName, oldProductId, newProductId } = req.body;
 if (!sectionName || !oldProductId || !newProductId) {
      return res.status(400).json({
        success: false,
        message: "sectionName, oldProductId, and newProductId are required",
      });
    }
    const sections = await SectionProModel.findOne({ section: sectionName});
    if (!sections) return res.status(404).json({ success: false, message: "Section not found" });

    // Find index and replace
    const index = sections.products.indexOf(oldProductId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Old product not found in section" });
    }

    sections.products[index] = newProductId;
    await sections.save();

    res.json({ success: true, message: "Product replaced successfully", data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const RemoveProductFromSection = async (req, res) => {
  try {
    const { section, productId } = req.body;

    if (!section || !productId) {
      return res.status(400).json({
        success: false,
        message: "Section name and Product ID are required",
      });
    }

    // Find section first
    const sectionData = await SectionProModel.findOne({ section });

    if (!sectionData) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Check if product exists in section
    const productIndex = sectionData.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in this section",
      });
    }

    // Remove product
    sectionData.products.splice(productIndex, 1);
    await sectionData.save();

    const updatedSection = await SectionProModel.findOne({ section }).populate("products");

    res.status(200).json({
      success: true,
      message: `Product removed from ${section} section successfully`,
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
