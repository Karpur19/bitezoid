import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import API from "../utils/api";
import { CartContext } from "../context/CartContext";

// Styled components for UI
const Container = styled.div`
  padding: 2rem;
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 350px;
  border-radius: 12px;
  object-fit: cover;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AddToCartButton = styled.button`
  background: #ff5722;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #e64a19;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useContext(CartContext);

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    

    // ✅ Fetch Restaurant Details (which includes the menu)
    API.get(`/restaurants/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setRestaurant(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurant details:", error);
        setError("Failed to load restaurant details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!restaurant) return <h2>Restaurant not found</h2>;

  return (
    <Container>
      <h1>{restaurant.name}</h1>
      <RestaurantImage src={restaurant.image} alt={restaurant.name} />
      <p>Cuisine: {restaurant.cuisine}</p>
      <p>Rating: ⭐ {restaurant.rating}</p>

      <h2>Menu</h2>
      {restaurant.menu && Array.isArray(restaurant.menu) ? (
        restaurant.menu.map((item) => {
          const itemInCart = cartItems?.some(
            (cartItem) => cartItem.id === String(item.id)
          );
          return (
            <MenuItem key={item.id}>
              <span>
                {item.name} - ₹{item.price}
              </span>
              <AddToCartButton onClick={() => addToCart(item)} disabled={itemInCart}>
                {itemInCart ? "Added" : "Add to Cart"}
              </AddToCartButton>
            </MenuItem>
          );
        })
      ) : (
        <p>No menu available for this restaurant.</p>
      )}
    </Container>
  );
};

export default RestaurantDetails;
