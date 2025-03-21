// src/pages/Restaurants.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const RestaurantContainer = styled.div`
  padding: 20px;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
`;

const RestaurantCard = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({ cuisine: "", rating: "" });

  useEffect(() => {
    // Fetch restaurants with applied filters
    const fetchRestaurants = async () => {
      const response = await axios.get("/api/restaurants", { params: filters });
      setRestaurants(response.data);
    };
    fetchRestaurants();
  }, [filters]); // Re-fetch restaurants whenever filters change

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <RestaurantContainer>
      <FilterSection>
        <select name="cuisine" onChange={handleFilterChange}>
          <option value="">Select Cuisine</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Italian">Italian</option>
          <option value="Thai">Thai</option>
          {/* Add more cuisines here */}
          <option value="Mexican">Mexican</option>
          <option value="Japanese">Japanese</option>
          <option value="American">American</option>
          <option value="French">French</option>
        </select>

        <select name="rating" onChange={handleFilterChange}>
          <option value="">Select Rating</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
          <option value="2">2+</option>
        </select>
      </FilterSection>

      <div>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id}>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.cuisine}</p>
              <p>Rating: {restaurant.rating}</p>
            </RestaurantCard>
          ))
        ) : (
          <p>No restaurants found based on the filters.</p>
        )}
      </div>
    </RestaurantContainer>
  );
};

export default Restaurants;
