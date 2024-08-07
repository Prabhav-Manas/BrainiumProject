const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
  price: { type: Number, required: true },
  offer: {
    startDate: { type: Date, required: true },
    closeDate: { type: Date, required: true },
  },
  discount: { type: Number, enum: [5, 10, 20], required: true },
});

module.exports = mongoose.model("Product", productSchema);
