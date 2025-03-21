import React, { useEffect, useState } from "react"; 
import styled from "styled-components";
import API from "../utils/api"; // ✅ Updated to fetch data dynamically
import { Link } from "react-router-dom";

const HomeContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ff5722;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-top: 0.5rem;
`;

const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 2rem;
`;

const RestaurantCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  object-fit: cover;
`;

const RestaurantName = styled.h3`
  margin: 1rem 0 0.5rem;
`;

const Rating = styled.p`
  font-weight: bold;
  color: #ff9800;
`;

const LoadingText = styled.h2`
  font-size: 1.5rem;
  color: #ff5722;
`;

const ErrorText = styled.h2`
  font-size: 1.5rem;
  color: red;
`;

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/restaurants")
      .then((response) => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setError("Failed to load restaurants.");
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <HomeContainer>
      <Title>Welcome to Bitezoid</Title>
      <Subtitle>Order your favorite meals from top restaurants near you!</Subtitle>

      <RestaurantGrid>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id}> {/* ✅ Changed to _id for MongoDB */}
            <Link to={`/restaurants/${restaurant._id}`}>
              <RestaurantImage 
                src={restaurant.image || "/fallback-image.jpg"} // Fallback image
                alt={restaurant.name} 
              />
              <RestaurantName>{restaurant.name}</RestaurantName>
            </Link>
            <p>{restaurant.cuisine}</p>
            <Rating>⭐ {restaurant.rating}</Rating>
          </RestaurantCard>
        ))}
      </RestaurantGrid>
    </HomeContainer>
  );
};

export default Home;
