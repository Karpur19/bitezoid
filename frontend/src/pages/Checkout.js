import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add axios for making API requests

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #ff5722;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 15px;

  &:hover {
    background: #e64a19;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Checkout = () => {
  const { cart, clearCart, restaurantId } = useContext(CartContext); // Ensure cart context has restaurantId
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (you may need to fetch user data from a context or localStorage)
    const userDetails = localStorage.getItem("user");
    setUser(userDetails ? JSON.parse(userDetails) : null);
  }, []);

  const handleCheckout = async () => {
    if (!name || !email || !phone) {
      alert("Please fill in all details");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1), // Handle quantity if available
      0
    );

    try {
      setLoading(true); // Show loading state
      const response = await axios.post(
        "http://localhost:5000/api/orders", // Replace with your backend API URL
        {
          restaurantId,
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1, // Ensure quantity is included in the order
          })),
          totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Add token from logged-in user
          },
        }
      );

      console.log(response.data); // You can log the response for debugging
      clearCart(); // Clear the cart after placing the order
      navigate("/order-confirmation", {
        state: { name, email, phone, cart, totalAmount },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <Container>
      <h2>Checkout</h2>
      <Input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <p>Total items: {cart.length}</p>
      <p>Total Price: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</p>
      <Button onClick={handleCheckout} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </Button>
    </Container>
  );
};

export default Checkout;
