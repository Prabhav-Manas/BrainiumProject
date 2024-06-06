const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sellerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  countryCode: { type: String, required: true },
  phone: { type: String, required: true },
  businessName: { type: String, required: true },
  gstNumber: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Seller", sellerSchema);
