import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Header = styled.h2`
  background-color: #ff5722;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const Button = styled.button`
  background: #ff5722;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.1rem;
  margin-top: 25px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e64a19;
  }
`;

const OrderedItem = styled.li`
  list-style-type: none;
  margin: 12px 0;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ItemDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ItemName = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
`;

const ItemPrice = styled.span`
  color: #ff5722;
  font-size: 1rem;
`;

const TotalAmountSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email, phone, cart } = location.state || {}; // Prevents undefined errors

  if (!cart) {
    return (
      <Container>
        <h2>No order details found. Please go back and place an order.</h2>
        <Button onClick={() => navigate("/")}>Go to Home</Button>
      </Container>
    );
  }

  // Calculate total if not passed directly
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // Formatting total amount with commas (for better readability)
  const formattedTotalAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalAmount);

  return (
    <Container>
      <Header>Order Confirmation</Header>
      <p>Thank you, <strong>{name || "Customer"}</strong>! Your order has been placed successfully.</p>
      <p>Email: {email || "Not provided"}</p>
      <p>Phone: {phone || "Not provided"}</p>
      
      <h3>Ordered Items:</h3>
      <ul>
        {cart.map((item) => (
          <OrderedItem key={item._id}>
            <ItemDetails>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>₹{item.price} x {item.quantity || 1}</ItemPrice>
            </ItemDetails>
          </OrderedItem>
        ))}
      </ul>

      <TotalAmountSection>
        <h3>Total Price: {formattedTotalAmount}</h3>
      </TotalAmountSection>

      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </Container>
  );
};

export default OrderConfirmation;
