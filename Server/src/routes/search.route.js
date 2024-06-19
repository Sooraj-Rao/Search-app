import express from "express";
const router = express.Router();
import Product from "../model/product.model.js";

router.get("/", async (req, res) => {
  const searchTerm = req.query.term;
  try {
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { category: { $regex: searchTerm, $options: "i" } },
          { name: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const results = await Product.find(query);

    res.json(results);
  } catch (error) {
    console.error("Error searching:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;
