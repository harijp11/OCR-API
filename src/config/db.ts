import mongoose from "mongoose";
import  dotenv from 'dotenv';
import { ENV } from "./env";

dotenv.config();

const connectDB = async () => {
  try {
    let mongoConnect = ENV.MONGO_URI as string
    const conn = await mongoose.connect(mongoConnect);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
