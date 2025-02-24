import Checkout from "./pages/Checkout"; // ✅ Import the Checkout page
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails"; // ✅ Ensure it's imported
import Cart from "./pages/Cart"; // ✅ Import Cart Page
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} /> {/* ✅ Fix dynamic restaurant routes */}
          <Route path="/cart" element={<Cart />} /> {/* ✅ Add cart route */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
