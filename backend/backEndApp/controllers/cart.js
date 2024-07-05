const CartItem = require("../models/cart");

exports.addToCart = async (req, res) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const userId = req.user._id;

  try {
    // Check if the item is already in the cart
    let cartItem = await CartItem.findOne({ productId, userId });

    console.log("CartIteming:=>", cartItem);

    if (cartItem) {
      // cartItem.quantity+=quantity;
      return res.status(400).json({
        message: "Item already exists in cart.",
        cartItem: cartItem,
      });
    } else {
      // Create new cart item if not already in the cart
      cartItem = new CartItem({
        productId,
        quantity,
        userId,
      });

      // Save the cart item
      await cartItem.save();

      console.log("CartItems:=>", cartItem);

      res.status(201).json({
        message: "Item added to the cart successfully.",
        cartItem: cartItem,
      });
    }
  } catch (error) {
    console.log("Error adding item to cart:", error);
    res.status(500).json({
      message: "Adding item to cart failed.",
      error: error.message,
    });
  }
};
