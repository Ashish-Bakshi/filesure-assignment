import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  try {
    const response = await mongoose.connect(MONGO_URI);
    if (!response) {
      throw new Error("Failed to connect to MongoDB");
    }
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("Some Error occured in MongoDB Connection : ", err);
    throw err;
  }
};

export default connectDB;
