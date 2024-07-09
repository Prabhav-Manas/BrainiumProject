const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const checkoutController = require("../controllers/checkout");
const authenticateUser = require("../middlewares/auth");

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  checkoutController.handleWebhook
);

router.post(
  "/create-checkout-session",
  authenticateUser,
  checkoutController.createCheckoutSession
);

module.exports = router;
