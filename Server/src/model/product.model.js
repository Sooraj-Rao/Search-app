import mongoose from "mongoose";

const ProductShcema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: Number,
});

const Product = mongoose.model("Product", ProductShcema);

export default Product;
