const Order = require("../models/order");

exports.saveOrder = async (req, res) => {
  const { userId, name, address, amount, paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({
      message: "paymentIntentId is required",
    });
  }

  const order = new Order({
    userId,
    name,
    address,
    amount,
    paymentIntentId,
    status: "pending",
  });

  try {
    const saveOrder = await order.save();
    res.status(201).json({
      message: "Order saved successfully!",
      order: saveOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save order",
      error: error.message,
    });
  }
};
