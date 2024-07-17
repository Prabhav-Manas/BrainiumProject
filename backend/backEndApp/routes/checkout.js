const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");

router.post("/payment-intent", checkoutController.paymentIntent);

module.exports = router;
