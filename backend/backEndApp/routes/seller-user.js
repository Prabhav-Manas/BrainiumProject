const express = require("express");
const router = express.Router();
const SellerUserController = require("../controllers/seller-user");
const {
  registerValidation,
  logInValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../middlewares/validators/seller-user-validator");
const { validate } = require("express-validation");

// ---SignUp API---
router.post(
  "/signup",
  validate(registerValidation, {}, {}),
  SellerUserController.createSellerUser
);

// ---EmailVerification API---
router.get("/verify/:token", SellerUserController.verificationEmail);

// ---SignIn API---
router.post(
  "/signin",
  validate(logInValidation, {}, {}),
  SellerUserController.logInSellerUser
);

// ---Forgot Password API---
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation, {}, {}),
  SellerUserController.forgotPassword
);

// ---RESET Password API---
router.post(
  "/reset-password",
  validate(resetPasswordValidation, {}, {}),
  SellerUserController.resetPassword
);

module.exports = router;
