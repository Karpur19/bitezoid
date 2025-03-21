const express = require("express");
const Order = require("../models/Order");
const { verifyUser, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Place an Order (Authenticated)
router.post("/", verifyUser, async (req, res) => {
  try {
    const { restaurantId, items, totalAmount } = req.body;

    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Invalid order details. Please provide valid data." });
    }

    const newOrder = await Order.create({
      userId: req.user.id, // ✅ Captures user ID from token
      restaurantId,
      items,
      totalAmount,
      status: "Pending", // ✅ Standard status for new orders
    });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

// ✅ Get Orders for Logged-in User
router.get("/user-orders", verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("restaurantId", "name image") // ✅ Populates restaurant details for clarity
      .exec();

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.json({ orders });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error.message);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// ✅ Get All Orders (Admin Only) - 🛠 FIXED: Removed Brackets
router.get("/", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("restaurantId", "name image").exec();

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.json({ orders });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error.message);
    res.status(500).json({ message: "Error fetching all orders", error: error.message });
  }
});

module.exports = router;
