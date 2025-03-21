const express = require("express");
const { signupUser, loginUser, getUserProfile } = require("../controllers/userController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", verifyUser, getUserProfile); // ✅ Fetch user details

module.exports = router;
