import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import searchRouter from "./src/routes/search.route.js";
import { connectDB } from "./src/db/connectDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
