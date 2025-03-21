import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const OffersPageContainer = styled.div`
  padding: 20px;
`;

const OfferCard = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    color: #ff5722;
  }

  p {
    color: #333;
  }

  button {
    background-color: #ff5722;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e64a19;
    }
  }
`;

const OffersPage = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Fetching offers (you can replace this with an API call)
    setOffers([
      { id: 1, title: '20% Off on First Order', description: 'Get 20% off on your first order from Bitezoid.', expiry: 'March 31, 2025' },
      { id: 2, title: 'Free Delivery on Orders Above Rs300', description: 'Enjoy free delivery when you order above $30.', expiry: 'April 15, 2025' },
      { id: 3, title: 'Buy 1 Get 1 Free on Selected Items', description: 'Get a free item when you buy one from selected categories.', expiry: 'March 28, 2025' },
    ]);
  }, []);

  return (
    <OffersPageContainer>
      <h2>Exclusive Offers</h2>
      {offers.map((offer) => (
        <OfferCard key={offer.id}>
          <h3>{offer.title}</h3>
          <p>{offer.description}</p>
          <p><strong>Expires on:</strong> {offer.expiry}</p>
          <button>Claim Offer</button>
        </OfferCard>
      ))}
    </OffersPageContainer>
  );
};

export default OffersPage;
