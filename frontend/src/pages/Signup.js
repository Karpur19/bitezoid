import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth
import styled from "styled-components";

const SignupContainer = styled.div`
  padding: 40px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

const Signup = () => {
  const { signup } = useAuth(); // ✅ Ensure signup function is correctly used
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state for user feedback

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Validation for email & phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(userData.email)) {
      setError("Invalid email format!");
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(userData.phone)) {
      setError("Invalid phone number! It should contain exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await signup(userData.name, userData.email, userData.phone, userData.password);
      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.message || "Signup failed! Please try again.");
      }
    } catch (error) {
      setError("Signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <h2>Signup</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form onSubmit={handleSubmit}>
        <InputField 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          value={userData.name} 
          onChange={handleChange} 
          required 
        />
        <InputField 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={userData.email} 
          onChange={handleChange} 
          required 
        />
        <InputField 
          type="tel" 
          name="phone" 
          placeholder="Phone Number" 
          value={userData.phone} 
          onChange={handleChange} 
          required 
        />
        <InputField 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={userData.password} 
          onChange={handleChange} 
          required 
        />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </SubmitButton>
      </form>
    </SignupContainer>
  );
};

export default Signup;
