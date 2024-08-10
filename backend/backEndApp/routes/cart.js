const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart");
const authenticateUser = require("../middlewares/auth");
const { validate } = require("express-validation");
const {
  addToCartValidation,
  updateCartItemValidation,
  removeCartItemValidation,
} = require("../middlewares/validators/cart-validator");

router.post(
  "/addCartItems",
  authenticateUser,
  validate(addToCartValidation, {}, {}),
  CartController.addToCart
);

router.get("/getCartItems", authenticateUser, CartController.getAllCartItems);

router.put(
  "/updateItem",
  authenticateUser,
  validate(updateCartItemValidation, {}, {}),
  CartController.updateCartItem
);

router.delete(
  "/removeCartItem/:cartItemId",
  authenticateUser,
  validate(removeCartItemValidation, {}, {}),
  CartController.removeCartItem
);

module.exports = router;
