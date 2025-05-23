import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const db = process.env.MONGODB_URI;
    const conn = await mongoose.connect(db);
    console.log("MongoDB connected successfully to", conn.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
