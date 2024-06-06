const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  countryCode: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  userType: {
    type: String,
    enum: ["user", "seller"],
    required: true,
    trim: true,
  },
  businessName: {
    type: String,
    required: function () {
      return this.userType === "seller";
    },
    trim: true,
  },
  gstNumber: {
    type: String,
    required: function () {
      return this.userType === "seller";
    },
    trim: true,
  },
  verificationToken: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
