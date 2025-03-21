require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser"); // Added for handling cookies

// Validate Required ENV Variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// Import Models
require("./models/User");
require("./models/Restaurant");
require("./models/Order");
require("./models/Cart");

// Import Routes
const authRoutes = require("./routes/authRoutes"); // ✅ Auth Routes
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cuisineRoutes = require("./routes/cuisineRoutes");
const menuRoutes = require("./routes/menuRoutes");
const { verifyUser } = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser()); // Added cookie parser middleware

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Lost:", err.message);
});

// API Routes
app.use("/api/auth", authRoutes); // ✅ Authentication Routes
app.use("/api/users", verifyUser, userRoutes); // 🔹 Protect user routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/cuisines", cuisineRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", verifyUser, cartRoutes);
app.use("/api/orders", verifyUser, orderRoutes); // 🔹 Protect order routes

// ✅ Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "Backend is running smoothly 🚀" });
});

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Bitezoid API!");
});

// ✅ Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await mongoose.connection.close();
  console.log("✅ MongoDB Disconnected");
  process.exit(0);
});

// ✅ Log Registered Routes
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(`✅ Registered Route: ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
