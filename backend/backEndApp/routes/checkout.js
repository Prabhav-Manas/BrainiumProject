const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");

// Route for creating payment intent
router.post("/payment-intent", checkoutController.createPaymentIntent);

// Route for saving order details
router.post("/save-order", checkoutController.saveOrderDetails);

// Updating Payment Status
router.post("/update-payment-status", checkoutController.updatePaymentStatus);

// Route for fetching orders by user
router.get("/order-history/:userId", checkoutController.getOrderHistory);

// Route for seller-orders
router.get("/seller-orders/:userId", checkoutController.getSellerOrders);

module.exports = router;
