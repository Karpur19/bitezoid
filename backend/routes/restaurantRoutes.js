const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

// ✅ Get all restaurants (with filters, search & pagination)
router.get("/", async (req, res) => {
  try {
    const { cuisine, minRating, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (cuisine) query.cuisine = { $regex: new RegExp(cuisine, "i") };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (search) query.name = { $regex: new RegExp(search, "i") };

    const restaurants = await Restaurant.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json(restaurants);
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    res.status(500).json({ message: "Error fetching restaurants", error: error.message });
  }
});

// ✅ Get a single restaurant by ID (Fix for menu structure)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Received restaurant ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Invalid restaurant ID format." });
    }

    const restaurant = await Restaurant.findById(id).lean(); // Use `.lean()` to get a plain object
    if (!restaurant) {
      return res.status(404).json({ message: "❌ Restaurant not found." });
    }

    // ✅ Ensure `menu` exists before mapping
    if (!restaurant.menu || !Array.isArray(restaurant.menu)) {
      restaurant.menu = []; // Set menu to empty array if undefined
    }

    // ✅ Safely transform menu items
    const updatedMenu = restaurant.menu.map(item => ({
      id: item._id.toString(),
      name: item.name,
      price: item.price
    }));
    
       

    res.json({ ...restaurant, menu: updatedMenu });
  } catch (error) {
    console.error(`❌ Error fetching restaurant with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error fetching restaurant", error: error.message });
  }
});

module.exports = router;
