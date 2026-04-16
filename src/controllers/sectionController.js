import SectionModel from "../models/sectionModel.js";
import SectionProModel from "../models/sectionProductModel.js"
export const GetSection = async (req, res) => {
  try {

    //find are all section
    const products = await SectionModel.find();
    res.status(200).json({ message: "All Section Detail retrieved", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const SectionAdd = async (req, res) => {
  try {
    const { section } = req.body;

    // Validation
    if (!section) {
      return res.status(400).json({ message: "Section is required" });
    }
    // Check if already exists
    const exists = await SectionModel.findOne({ section });
    if (exists) {
      return res.status(400).json({ message: "section already exists" });
    }

    // Create new category
    const newsection = new SectionModel({ section });
    await newsection.save();

    res.status(201).json({
      success: true,
      message: "Section added successfully!",
    });
  } catch (err) {
    
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
 export const SectionUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { section } = req.body;

    // Validation
    if (!section) {
      return res.status(400).json({ message: "Section name is required" });
    }

    // Check if section exists
    const existing = await SectionModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Save old name (for matching in SectionProModel)
    const oldSectionName = existing.section;

    // Step 1: Update Section name
    existing.section = section;
    const updatedSection = await existing.save();

    // Step 2: Update section name in SectionProModel
    await SectionProModel.updateMany(
      { section: oldSectionName },
      { section: section }
    );

    res.status(200).json({
      success: true,
      message: "Section updated successfully in both collections!",
      data: updatedSection,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const SectionDelete = async (req, res) => {
  try {
    const { id } = req.params;

    //  Step 1: Check if section exists
    const existing = await SectionModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    //  Step 2: Delete section from SectionModel
    await SectionModel.findByIdAndDelete(id);

    //  Step 3: Delete same section from SectionProModel (by section name)
    await SectionProModel.findOneAndDelete({ section: existing.section });

    //  Step 4: Response
    res.status(200).json({
      success: true,
      message: `Section '${existing.section}' and its related SectionPro deleted successfully!`,
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
