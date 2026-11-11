import mongoose from "mongoose";
import { connectDB } from "../lib/mongoose";

async function seed() {
  try {
    console.log("🌱 Initializing MongoDB connection for seed...");
    await connectDB();
    console.log("✅ Database connected successfully.");
    console.log("ℹ️ Ready for domain models. Import your Mongoose models here to insert initial records.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB.");
  }
}

seed();

