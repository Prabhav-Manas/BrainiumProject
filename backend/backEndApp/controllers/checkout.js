const stripe = require("../services/stripe");
const Checkout = require("../models/checkout");

exports.createCheckoutSession = async (req, res) => {
  const { items } = req.body;
  const userId = req.user._id;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.productName,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: { userId: userId.toString() },
    });

    // ---Store Checkout Details in Database---
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const newCheckout = new Checkout({
      user: userId,
      items: items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentStatus: "pending",
    });
    await newCheckout.save();

    res.json({
      id: session.id,
      checkoutId: newCheckout._id,
    });
  } catch (error) {
    console.log("Checkout Session Error:=>", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.handleWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  // ---Handle the Event---
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userId = session.metadata.userId;

      try {
        await Checkout.findOneAndUpdate(
          { user: userId, paymentStatus: "pending" },
          { paymentStatus: "completed" }
        );
      } catch (error) {
        console.error(
          `Error updating checkout for user ${userId}: ${error.message}`
        );
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).end();
};
