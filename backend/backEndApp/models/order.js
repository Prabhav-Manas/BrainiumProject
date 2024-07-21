const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true }, // Amount in cents
  paymentIntentId: { type: String, required: true },
  status: { type: String, default: "pending" }, // e.g., pending, completed
});

module.exports = mongoose.model("Order", orderSchema);
