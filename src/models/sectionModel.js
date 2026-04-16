// model/sectionModel.js
import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  section: { type: String, required: true, trim: true, unique:true,lowercase:true },
}, { timestamps: true });

const SectionModel = mongoose.model("Section", SectionSchema);
export default SectionModel;
