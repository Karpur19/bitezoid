import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const DashboardContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const OrderList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const OrderItem = styled.li`
  background: #f8f8f8;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const LogoutButton = styled.button`
  margin-top: 10px;
  background: red;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  border: none;
  
  &:hover {
    background: darkred;
  }
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/orders/user-orders", {
        headers: { Authorization: `Bearer ${user.token}` }, // ✅ Send JWT Token
      })
      .then((response) => setOrders(response.data.orders))
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to load your orders.");
      });
  }, [user.token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardContainer>
      <h2>Welcome, {user.name} 👋</h2>
      <p>Email: {user.email}</p>

      <h3>Your Orders</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <OrderList>
          {orders.map((order) => (
            <OrderItem key={order._id}>
              🛒 {order.items.length} items - ₹{order.total} - {order.status}
            </OrderItem>
          ))}
        </OrderList>
      )}

      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </DashboardContainer>
  );
};

export default Dashboard;
