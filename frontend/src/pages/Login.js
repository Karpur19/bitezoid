import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api"; // ✅ Import API for requests
import styled from "styled-components";

const LoginContainer = styled.div`
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

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Validate email and password fields
    if (!credentials.email || !credentials.password) {
      setError("Please fill in both fields.");
      setLoading(false);
      return;
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError("Invalid email format!");
      setLoading(false);
      return;
    }

    console.log("🔄 Attempting login with:", credentials);

    try {
      const response = await API.post("/auth/login", credentials);

      console.log("✅ Backend Response:", response.data);

      if (response.data.token) {
        // ✅ Store token and user data securely
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("token", response.data.token);

        // ✅ Set Authorization header for future requests
        API.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

        console.log("🔹 Token stored & API header set");

        navigate("/dashboard");
      } else {
        console.error("❌ No token received in response.");
        setError("Login successful, but no token received.");
      }
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form onSubmit={handleSubmit}>
        <InputField 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={credentials.email} 
          onChange={handleChange} 
          required 
        />
        <InputField 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={credentials.password} 
          onChange={handleChange} 
          required 
        />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </SubmitButton>
      </form>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <a href="/forgot-password" style={{ color: "#007bff", textDecoration: "none" }}>Forgot Password?</a>
      </div>
    </LoginContainer>
  );
};

export default Login;
