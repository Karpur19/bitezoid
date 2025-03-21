const jwt = require("jsonwebtoken");

// Helper function to handle errors
const handleError = (res, error) => {
  console.error("❌ Authentication Error:", error);
  
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token. Authentication failed." });
  } else if (error.name === "NotBeforeError") {
    return res.status(401).json({ message: "Token is not yet active." });
  }

  res.status(500).json({ message: "Authentication error. Please try again later." });
};

// Middleware to verify user authentication
const verifyUser = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    let token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1].trim() : authHeader.trim();
    
    // Log the token for debugging (remove in production)
    console.log("Token received:", token);

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded; // Attach user data to request object

    next(); // Move to next middleware or route
  } catch (error) {
    handleError(res, error);
  }
};

// Verify if the user is an admin
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { verifyUser, verifyAdmin };
