const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

// ✅ Get Menu for a Specific Restaurant
router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // ✅ Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format." });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    if (!restaurant.menu || !restaurant.menu.length) {
      return res.status(404).json({ message: "No menu found for this restaurant." });
    }

    // ✅ Ensure menu items have consistent ID format for frontend
    const updatedMenu = restaurant.menu.map((item) => ({
      ...item,
      id: item.id ? item.id.toString() : mongoose.Types.ObjectId().toString()
    }));

    res.json(updatedMenu);  // Sending corrected menu structure
  } catch (error) {
    console.error("❌ Error fetching menu:", error);
    res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
});

// ✅ Add Menu Items (Optional - For Admin Panel)
router.post("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { menu } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    restaurant.menu.push(...menu);
    await restaurant.save();

    res.json({ message: "Menu items added successfully.", menu: restaurant.menu });
  } catch (error) {
    console.error("❌ Error adding menu:", error);
    res.status(500).json({ message: "Error adding menu", error: error.message });
  }
});

module.exports = router;
