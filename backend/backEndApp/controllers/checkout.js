const stripe = require("../services/stripe");
const mongoose = require("mongoose");
const Checkout = require("../models/checkout");
const User = require("../models/seller-user"); // Ensure this is correct for user info

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId, name, delivery, cartItems } = req.body;

    console.log("Received cartItems:", cartItems);

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    // Check if all cartItems have sellerId
    // for (const item of cartItems) {
    //   if (!item.sellerId) {
    //     return res.status(400).json({
    //       message: "All cart items must have a sellerId",
    //     });
    //   }
    // }

    // Create a new payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    // Optionally: Save payment details in the database
    const checkout = await Checkout.create({
      userId,
      cartItems,
      amount,
      payment: {
        id: paymentIntent.id,
        status: "pending", // Initial Status
      },
      name,
      delivery,
    });

    console.log("Checkout CartItems:=>", checkout);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.log("Error creating payment intent:", error.message);
    res.status(500).json({
      message: "An error occurred while creating payment intent",
      error: error.message,
    });
  }
};

// ---Save Order Details---
exports.saveOrderDetails = async (req, res) => {
  try {
    const { userId, name, amount, payment, cartItems, delivery } = req.body;

    // Check if payment and cartItems are provided
    if (!payment || !payment.id || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({
        message: "Payment details, paymentId, and valid cartItems are required",
      });
    }

    // Check if each cartItem has a sellerId
    // for (const item of cartItems) {
    //   if (!item.sellerId) {
    //     return res.status(400).json({
    //       message: "All cart items must include a sellerId",
    //     });
    //   }
    // }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Convert each productId in cartItems to ObjectId
    const cartItemsWithObjectId = cartItems.map((item) => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
      // sellerId: new mongoose.Types.ObjectId(item.sellerId),
    }));

    // Create a new order record
    const orderDetails = await Checkout.create({
      userId: userObjectId,
      name,
      amount,
      payment: {
        id: payment.id,
        status: payment.status,
      },
      cartItems: cartItemsWithObjectId,
      delivery,
    });

    console.log("ORDER_Checkout:=>", orderDetails);

    res.status(200).json({
      message: "Order details saved successfully",
      order: orderDetails,
    });
  } catch (error) {
    console.error("Error saving order details:", error.message);
    res.status(500).json({
      message: "An error occurred while saving order details",
      error: error.message,
    });
  }
};

// ---Update Payment Status---
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment, status } = req.body;

    if (!payment || !payment.id || !status) {
      return res.status(400).json({
        message: "Payment details and status are required!",
      });
    }

    // Update Payment Status in Checkout Collection
    const updatedCheckout = await Checkout.findOneAndUpdate(
      { "payment.id": payment.id },
      { "payment.status": status },
      { new: true }
    );

    if (!updatedCheckout) {
      return res.status(404).json({
        message: "Payment not found in Checkout!",
      });
    }

    res.status(200).json({
      message: "Payment Status Updated Successfully!",
      checkout: updatedCheckout,
    });
  } catch (error) {
    console.log("Error updating payment status", error);
    res.status(500).json({
      message: "An error occurred while updating payment status",
      error: error.message,
    });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("OrderHistory UserID:=>", userId);

    const query = userId ? { userId } : {};

    const orders = await Checkout.find(query)
      .sort({ createdAt: -1 }) // Sort orders by createdAt in descending order
      .populate({
        path: "cartItems.productId",
        select: "productName price category imagePath",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate("userId", "name email userType"); // Get data Using aggregiate

    if (orders.length > 0) {
      return res.status(200).json({
        message: "Orders fetched",
        orders: orders,
      });
    } else {
      return res.status(400).json({
        message: "No Order found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Aggregation-based getSellerOrders
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.params.userId;
    console.log("Fetching orders for seller ID:", sellerId);

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        message: "Invalid or missing seller ID",
      });
    }

    const objectIdSellerId = new mongoose.Types.ObjectId(sellerId);

    const orders = await Checkout.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: { "productDetails.seller": objectIdSellerId },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          cartItems: {
            $push: {
              productId: "$productDetails._id",
              quantity: "$cartItems.quantity",
              productDetails: {
                productName: "$productDetails.productName",
                price: "$productDetails.price",
                imagePath: "$productDetails.imagePath",
              },
            },
          },
          amount: { $first: "$amount" },
          payment: { $first: "$payment" },
          name: { $first: "$name" },
          delivery: { $first: "$delivery" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          userDetails: {
            $first: {
              name: "$userDetails.name",
              email: "$userDetails.email",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          userId: 1,
          cartItems: 1,
          amount: 1,
          payment: 1,
          name: 1,
          delivery: 1,
          createdAt: 1,
          updatedAt: 1,
          userDetails: 1,
        },
      },
    ]);

    if (orders.length > 0) {
      return res.status(200).json({
        message: "Orders fetched",
        orders: orders,
      });
    } else {
      return res.status(404).json({
        message: "No orders found for this seller",
      });
    }
  } catch (error) {
    console.error("Error fetching orders for seller:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching orders",
      error: error.message,
    });
  }
};
