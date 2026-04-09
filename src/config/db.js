import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      family: 4, // Force IPv4
    });
    console.log("MongoDB connected successfully");

    // Seed default admin after connection
    // await seedDefaultAdmin();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process on DB connection failure
  }
};

export default connectDB;
