import "@/app/models/usermodel";
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) return;

  const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!MONGO_URI) throw new Error("❌ MONGO_URI is not defined");

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};
