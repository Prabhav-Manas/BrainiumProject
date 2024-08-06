const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  payment: {
    id: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  name: { type: String }, // Name field
  delivery: {
    address: { type: String },
    deliveryStatus: { type: String, default: "processing" },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Checkout", checkoutSchema);
