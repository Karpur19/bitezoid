import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/footer"; // ✅ Added Footer Import
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OffersPage from "./pages/OffersPage"; // ✅ Added Offers Page Import

function App() {
  const [backendMessage, setBackendMessage] = useState("Checking backend...");

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    console.log("🔍 Checking backend health at:", `${backendUrl}/health`); // Debug log

    axios
      .get(`${backendUrl}/health`)
      .then((response) => {
        console.log("✅ Backend response:", response.data); // Debugging

        // Ensure we safely extract the message
        const message = response.data?.message || "Backend is running";
        setBackendMessage(message);
      })
      .catch((error) => {
        console.error("❌ Error connecting to backend:", error);
        setBackendMessage("⚠️ Backend is offline");
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar backendMessage={backendMessage} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Route>

          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          
          {/* ✅ Added Offers Route */}
          <Route path="/offers" element={<OffersPage />} />
        </Routes>
        <Footer /> {/* ✅ Added Footer Component */}
      </Router>
    </AuthProvider>
  );
}

export default App;
