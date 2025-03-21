import React, { createContext, useState, useEffect } from "react";
import API from "../utils/api"; // ✅ Ensure this is correctly configured

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await API.get("/cart");
        setCart(response.data.items || []);
      } catch (error) {
        console.error("❌ Error fetching cart:", error.response?.data || error.message);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (item) => {
    try {
      console.log("🛒 Adding item to cart:", item);

      const payload = {
        itemId: item.id || item._id, // ✅ Ensure correct key
        name: item.name,
        price: item.price,
        quantity: 1, // ✅ Ensure quantity is included
      };

      const response = await API.post("/cart", payload);

      console.log("✅ API Response:", response.data);

      setCart((prevCart) => [...prevCart, response.data.item]);
    } catch (error) {
      console.error("❌ Error adding item to cart:", error.response?.data || error.message);
    }
  };

  const removeFromCart = async (item) => {
    try {
      await API.delete(`/cart/${item.id || item._id}`);
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
    } catch (error) {
      console.error("❌ Error removing item from cart:", error.response?.data || error.message);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart");
      setCart([]);
    } catch (error) {
      console.error("❌ Error clearing cart:", error.response?.data || error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
