const express = require("express");
const SellerUserController = require("../controllers/seller-user");
const router = express.Router();

// ---SignUp API---
router.post("/signup", SellerUserController.createSellerUser);

// ---EmailVerification API---
router.get("/verify/:token", SellerUserController.verificationEmail);

// ---SignIn API---
router.post("/signin", SellerUserController.logInSellerUser);

module.exports = router;
