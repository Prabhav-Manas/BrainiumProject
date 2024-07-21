const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  address: { type: String },
  amount: { type: Number, required: true }, // Amount in cents
  paymentIntentId: { type: String, required: true },
  status: { type: String, default: "pending" }, // e.g., pending, completed
});

module.exports = mongoose.model("Payment", paymentSchema);
