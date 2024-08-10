const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const { validate } = require("express-validation");
const {
  createPaymentIntentValidation,
  saveOrderDetailsValidation,
  updatePaymentStatusValidation,
  getOrderHistoryValidation,
  getSellerOrdersValidation,
} = require("../middlewares/validators/checkout-validator");

// Route for creating payment intent
router.post(
  "/payment-intent",
  // validate(createPaymentIntentValidation, {}, {}),
  checkoutController.createPaymentIntent
);

// Route for saving order details
router.post(
  "/save-order",
  // validate(saveOrderDetailsValidation, {}, {}),
  checkoutController.saveOrderDetails
);

// Updating Payment Status
router.post(
  "/update-payment-status",
  // validate(updatePaymentStatusValidation, {}, {}),
  checkoutController.updatePaymentStatus
);

// Route for fetching orders by user
router.get(
  "/order-history/:userId",
  // validate(getOrderHistoryValidation, {}, {}),
  checkoutController.getOrderHistory
);

// Route for seller-orders
router.get(
  "/seller-orders/:userId",
  // validate(getSellerOrdersValidation, {}, {}),
  checkoutController.getSellerOrders
);

module.exports = router;
