const CartItem = require("../models/cart");
const Product = require("../models/product");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Assuming req.user is correctly populated

  try {
    // Check if the item is already in the cart
    let cartItem = await CartItem.findOne({ product: productId, user: userId });

    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += quantity;
      await cartItem.save();

      return res.status(200).json({
        message: "Item quantity updated in the cart.",
        cartItem: cartItem,
      });
    } else {
      // Fetch the product details to ensure productId is valid
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      // Create new cart item if not already in the cart
      cartItem = new CartItem({
        product: productId,
        quantity,
        user: userId,
      });

      // Save the cart item
      await cartItem.save();

      res.status(201).json({
        message: "Item added to the cart successfully.",
        cartItem: cartItem,
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      message: "Adding item to cart failed.",
      error: error.message,
    });
  }
};

exports.getAllCartItems = async (req, res) => {
  const userId = req.user._id;

  try {
    const cartItems = await CartItem.find({ user: userId })
      .populate("user")
      .populate("product");

    if (cartItems.length === 0) {
      return res.status(404).json({
        message: "No items added in cart",
      });
    } else {
      res.status(200).json({
        message: "Cart Items fetched successfully!",
        cartItems: cartItems,
      });
    }
  } catch (error) {
    console.log("Error in fetching cart Items:=>", error);
    res.status(500).json({
      message: "Fetching cart items failed!",
      error: error.message,
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    // if (!quantity || quantity <= 0) {
    //   res.status(400).json({
    //     message: "Quantity must be greater than 0",
    //   });
    // }

    const updatedCartItem = await CartItem.findByIdAndUpdate(
      cartItemId,
      { quantity: quantity },
      { new: true }
    );

    if (!updatedCartItem) {
      res.status(400).json({
        message: "Cart item not found!",
      });
    }
    res.status(200).json({
      message: "Cart item update Successfull!",
      updatedCartItem: updatedCartItem,
    });
  } catch (error) {
    console.log("Error in updating cart item:=>", error);
    res.status(500).json({
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const removedCartItem = await CartItem.findByIdAndDelete(cartItemId);

    if (!removedCartItem) {
      res.status(404).json({
        message: "Cart item not found!",
      });
    }
    res.status(200).json({
      message: "Cart Item removed successfully!",
      removedCartItem: removedCartItem,
    });
  } catch (error) {
    console.log("Error in removing cart item", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
