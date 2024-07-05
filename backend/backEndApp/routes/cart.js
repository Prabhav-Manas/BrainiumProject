const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart");
const authenticateUser = require("../middlewares/auth");

router.post("/addCartItems", authenticateUser, CartController.addToCart);

module.exports = router;
