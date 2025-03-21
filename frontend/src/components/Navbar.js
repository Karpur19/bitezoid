import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBell } from "react-icons/fa";
import styled from "styled-components";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #ff5722, #ff8c00); /* Red to Orange Gradient */
  color: white;
  flex-wrap: wrap;
  position: relative;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: space-between;
  }
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    position: absolute;
    top: 50px;
    right: 0;
    background: #ff5722;
    width: 100%;
    padding: 1rem;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 1.2rem;
  padding: 8px 15px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: #ffd54f;
    color: #333;
  }
`;

const BackendStatus = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: ${({ $isConnected }) => ($isConnected ? "lightgreen" : "red")};
`;

const CartIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -10px;
  background: red;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationIconWrapper = styled.div`
  position: relative;
  margin-right: 20px;
  cursor: pointer;
`;

const NotificationCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const SearchBar = styled.input`
  padding: 8px 12px;
  border-radius: 20px;
  border: none;
  width: 200px;
  margin-left: 20px;
  outline: none;
`;

const HamburgerMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    cursor: pointer;
  }
`;

const HamburgerIcon = () => (
  <div style={{ width: '30px', height: '3px', background: 'white', margin: '6px 0' }} />
);

const Navbar = ({ backendMessage }) => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useAuth();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <NavbarContainer>
      <div>
        <Logo>Bitezoid</Logo>
        <BackendStatus $isConnected={backendMessage.includes("Backend is running")}>
          {backendMessage.includes("Backend is running") ? "✅ Backend Connected" : "❌ Backend Offline"}
        </BackendStatus>
      </div>

      {/* Hamburger Menu for Mobile */}
      <HamburgerMenu onClick={() => setIsNavOpen(!isNavOpen)}>
        <HamburgerIcon />
        <HamburgerIcon />
        <HamburgerIcon />
      </HamburgerMenu>

      {/* Navigation Links */}
      <NavLinks isOpen={isNavOpen}>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/restaurants">Restaurants</NavLink></li>
        <li><NavLink to="/offers">Offers</NavLink></li>
      </NavLinks>

      {/* Search Bar */}
      <div>
        <SearchBar type="text" placeholder="Search for restaurants..." />
      </div>

      {/* Notification, Cart, and User/Authentication */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <NotificationIconWrapper>
          <FaBell size={24} />
          <NotificationCount>5</NotificationCount>
        </NotificationIconWrapper>

        <CartIconWrapper onClick={toggleCart}>
          <FaShoppingCart size={24} />
          <CartCount>{cart.length}</CartCount>
        </CartIconWrapper>

        {/* Cart Dropdown or Modal */}
        {isCartOpen && (
          <div style={{ position: "absolute", top: "50px", right: "10px", background: "white", padding: "1rem", borderRadius: "5px", boxShadow: "0px 5px 10px rgba(0,0,0,0.3)" }}>
            <h3>Cart Items</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id}>
                  <p>{item.name} - ${item.price}</p>
                </div>
              ))
            )}
            <Link to="/cart">Go to Cart</Link>
          </div>
        )}

        {/* User Dropdown Menu */}
        {user ? (
          <div>
            <div onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
              {user.name}
            </div>
            {isDropdownVisible && (
              <div>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/orders">Orders</NavLink>
                <NavLink to="/logout" onClick={logout}>Logout</NavLink>
              </div>
            )}
          </div>
        ) : (
          <AuthButtons>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </AuthButtons>
        )}
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
