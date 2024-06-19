import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  let DB_URL = process.env.MONGO_URI;
  await mongoose
    .connect(DB_URL)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("DB connection failed", err));
};
