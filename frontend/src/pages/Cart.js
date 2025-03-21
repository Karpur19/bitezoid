import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import styled from "styled-components";
import API from "../utils/api"; // API utility to interact with backend

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const Button = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const QuantityButton = styled.button`
  background: #ff5722;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const CheckoutButton = styled(Link)`
  display: inline-block;
  background: #ff5722;
  color: white;
  text-decoration: none;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  margin-top: 15px;
`;

const TotalPrice = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 20px;
`;

const Cart = () => {
  const { cart, removeFromCart, updateCart } = useContext(CartContext); // Ensure updateCart exists in context
  const [loading, setLoading] = useState(false);

  // Calculate total price considering quantity
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1), // Handle quantity
    0
  );

  const handleRemove = async (item) => {
    try {
      setLoading(true);
      await API.delete(`/cart/${item.itemId}`); // Ensure backend API for removing cart item
      removeFromCart(item);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error removing item from cart", error);
    }
  };

  const handleQuantityChange = async (item, action) => {
    try {
      setLoading(true);
      const updatedQuantity =
        action === "increment" ? item.quantity + 1 : item.quantity - 1;
      if (updatedQuantity <= 0) return; // Prevent removing items through quantity change
      await API.post("/cart", {
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: updatedQuantity,
      }); // Ensure backend API for updating cart item quantity
      updateCart(item, updatedQuantity); // Update local cart state
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating item quantity", error);
    }
  };

  return (
    <Container>
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <div>
          <p>Your cart is empty</p>
          <Link to="/restaurants">Go back to restaurants</Link>
        </div>
      ) : (
        <>
          {cart.map((item, index) => (
            <CartItem key={index}>
              <span>
                {item.name} - ₹{item.price} x {item.quantity || 1}
              </span>
              <div>
                <QuantityButton
                  onClick={() => handleQuantityChange(item, "decrement")}
                  disabled={loading}
                >
                  -
                </QuantityButton>
                <QuantityButton
                  onClick={() => handleQuantityChange(item, "increment")}
                  disabled={loading}
                >
                  +
                </QuantityButton>
                <Button onClick={() => handleRemove(item)} disabled={loading}>
                  Remove
                </Button>
              </div>
            </CartItem>
          ))}
          <TotalPrice>Total: ₹{totalPrice}</TotalPrice>
          <CheckoutButton to="/checkout">
            Proceed to Checkout
          </CheckoutButton>
        </>
      )}
    </Container>
  );
};

export default Cart;
