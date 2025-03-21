const express = require("express");
const { register, login, getProfile, refreshToken } = require("../controllers/authController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route for user registration
router.post("/register", async (req, res, next) => {
  try {
    await register(req, res);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Route for user login
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Route for refreshing the access token using refresh token
router.post("/refresh-token", async (req, res, next) => {
  try {
    await refreshToken(req, res);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Route for getting user profile (protected)
router.get("/profile", verifyUser, async (req, res, next) => {
  try {
    await getProfile(req, res);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

module.exports = router;
