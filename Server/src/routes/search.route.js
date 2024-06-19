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
    if (results.length == 0)
      res.json({
        error: true,
        message: "No products found",
        result: results,
      });
    else res.json({ result: results, error: false, message: "success" });
  } catch (error) {
    console.error("Error searching:", error);
    res.json({
      error: true,
      message: "Internal Server Error",
      result: null,
      statusCode: 500,
    });
  }
});

export default router;
