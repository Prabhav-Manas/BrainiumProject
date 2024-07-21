const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");

// Route for creating payment intent
router.post("/payment-intent", checkoutController.createPaymentIntent);

// Route for saving order details
router.post("/save-order", checkoutController.saveOrderDetails);

// Updating Payment Status

router.post("/update-payment-status", checkoutController.updatePaymentStatus);

module.exports = router;
