const stripe = require("../services/stripe");
const Order = require("../models/order");
const Payment = require("../models/payment");
const User = require("../models/seller-user"); // Ensure this is correct for user info

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId, name, address } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Create a new payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    // Optionally: Save payment details in the database
    await Payment.create({
      userId,
      amount,
      status: "pending",
      paymentIntentId: paymentIntent.id,
      name,
      address,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.log("Error creating payment intent:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating payment intent" });
  }
};

// Save Order Details
exports.saveOrderDetails = async (req, res) => {
  try {
    const { userId, name, address, amount, paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        message: "paymentIntentId is required",
      });
    }

    // Create a new order record
    const order = await Order.create({
      userId,
      name,
      address,
      amount,
      paymentIntentId,
      status: "pending", // Default status, you may update it after payment confirmation
    });

    res
      .status(200)
      .json({ message: "Order details saved successfully", order });
  } catch (error) {
    console.error("Error saving order details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving order details" });
  }
};

// ---Update Payment Status---
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;

    if (!paymentIntentId || !status) {
      return res.status(400).json({
        message: "PaymentIntentId and status are required!",
      });
    }

    // Update Payment Status in Payment Collection
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId },
      { status },
      { new: true }
    );

    // Update Order Status in Order Collection if payment is completed
    if (status === "completed") {
      await Order.findOneAndUpdate(
        { paymentIntentId },
        { status },
        { new: true }
      );
    }

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found!",
      });
    }
    res.status(200).json({
      message: "Payment Status Updated Successfully!",
    });
  } catch (error) {
    console.log("Error updating payment status", error);
    res.status(500).json({
      message: "An error occured while updating payment status",
    });
  }
};
