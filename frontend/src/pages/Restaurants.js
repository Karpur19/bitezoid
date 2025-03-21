import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import API from "../utils/api";

// Styled Components
const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.07);
  }
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
`;

const RestaurantName = styled.h3`
  margin-top: 10px;
  color: #e91e63;
`;

const RestaurantCuisine = styled.p`
  color: #555;
  font-size: 0.9rem;
`;

const Rating = styled.p`
  font-weight: bold;
  color: #ff9800;
`;

const Tag = styled.span`
  background-color: #4caf50;
  color: #fff;
  font-size: 0.8rem;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 8px;
`;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("");
  const [loading, setLoading] = useState(true);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    // Fetching restaurants
    API.get("/restaurants")
      .then((response) => {
        console.log("Fetched restaurants:", response.data);
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      });

    // Fetching available cuisines
    API.get("/cuisines")
      .then((response) => setCuisines(response.data))
      .catch((error) => console.error("Error fetching cuisines:", error));
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCuisine === "" || restaurant.cuisine.toLowerCase() === filterCuisine.toLowerCase())
  );

  return (
    <Container>
      <h1>Explore Restaurants</h1>

      {/* Search Bar */}
      <SearchBar
        type="text"
        placeholder="Search Restaurants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Cuisine Filter */}
      <FilterSelect value={filterCuisine} onChange={(e) => setFilterCuisine(e.target.value)}>
        <option value="">All Cuisines</option>
        {cuisines.map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </FilterSelect>

      {/* Loading Indicator */}
      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <Grid>
          {filteredRestaurants.map((restaurant) => {
            const restaurantId = restaurant.id || restaurant._id;
            return (
              <Link key={restaurantId} to={`/restaurants/${restaurantId}`} style={{ textDecoration: "none" }}>
                <Card>
                  <RestaurantImage src={restaurant.image} alt={restaurant.name} />
                  <RestaurantName>{restaurant.name}</RestaurantName>
                  <RestaurantCuisine>{restaurant.cuisine} Cuisine</RestaurantCuisine>
                  {restaurant.isPromoted && <Tag>Promoted</Tag>}
                  <Rating>⭐ {restaurant.rating}</Rating>
                </Card>
              </Link>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Restaurants;
