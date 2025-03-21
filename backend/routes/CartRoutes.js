const express = require("express");
const Cart = require("../models/Cart"); // Cart model
const { verifyUser } = require("../middlewares/authMiddleware"); // Correct Import
const router = express.Router();

// Helper function to handle errors
const handleError = (res, error) => {
  console.error(error); // Log the error for debugging
  return res.status(500).json({ message: "Internal Server Error", error: error.message });
};

// Add item to cart
router.post("/", verifyUser, async (req, res) => {
  try {
    const { itemId, name, price } = req.body;
    if (!itemId || !name || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user.id; // Get user ID from middleware

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the item already exists in the cart
    const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);

    if (itemIndex > -1) {
      // If item exists, increment the quantity
      cart.items[itemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add it to the cart
      cart.items.push({ itemId, name, price, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    handleError(res, error);
  }
});

// Remove item from cart
router.delete("/:itemId", verifyUser, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove item from cart
    cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    handleError(res, error);
  }
});

// Clear all items from cart
router.delete("/", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Clear all items from the cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    handleError(res, error);
  }
});

// Get user's cart details (Return empty cart instead of 404)
router.get("/", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId }).populate("items.itemId"); // Ensure itemId is a valid reference

    // If cart doesn't exist, return an empty cart instead of 404
    if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty cart
    }

    res.status(200).json(cart); // Return cart with items
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
