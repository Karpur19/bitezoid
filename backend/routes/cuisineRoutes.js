const express = require("express");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

// Helper function to handle errors
const handleError = (res, error) => {
  console.error(error); // Log error for debugging (could use a more sophisticated logging system in production)
  return res.status(500).json({ message: "Internal Server Error", error: error.message });
};

// Get All Unique Cuisines
router.get("/", async (req, res) => {
  try {
    const cuisines = await Restaurant.distinct("cuisine");

    if (!cuisines.length) {
      return res.status(404).json({ message: "No cuisines found." });
    }

    res.status(200).json(cuisines); // Added status code for successful response
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
