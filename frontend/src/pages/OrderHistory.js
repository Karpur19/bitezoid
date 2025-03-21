import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  background-color: #ff5722;
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const OrderItem = styled.div`
  background: #fff;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const OrderDetails = styled.div`
  margin-bottom: 1rem;
`;

const Status = styled.p`
  color: ${(props) => (props.status === "Delivered" ? "green" : "orange")};
  font-weight: bold;
`;

const Button = styled.button`
  background: #ff5722;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.1rem;
  margin-top: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e64a19;
  }
`;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userToken = localStorage.getItem("user")?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/user-orders", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (userToken) fetchOrders();
  }, [userToken]);

  return (
    <Container>
      <Header>Order History</Header>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <OrderItem key={order._id}>
            <OrderDetails>
              <h3>Order #{order._id}</h3>
              <p><strong>Restaurant:</strong> {order.restaurantId.name}</p>
              <Status status={order.status}>Status: {order.status}</Status>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            </OrderDetails>
            <Button onClick={() => navigate(`/order/${order._id}`)}>View Details</Button>
          </OrderItem>
        ))
      )}
    </Container>
  );
};

export default OrderHistory;
