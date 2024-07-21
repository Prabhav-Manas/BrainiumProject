const stripe = require("../services/stripe");
const Payment = require("../models/payment");

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const userName = session.metadata.userName;

    const payment = new Payment({
      userId: userId,
      userName: userName,
      amount: session.amount_total / 100,
      currency: session.currency,
      paymentStatus: session.payment_status,
      paymentId: session.payment_intent,
    });

    try {
      await payment.save();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save payment data" });
    }
  } else {
    res.staus(400).json({ error: "Unhandled event type" });
  }
};
