import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"; // ✅ Correct import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user and token from localStorage on refresh
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setAuthToken(storedToken);  // Set the token in headers if it exists
        }
      } catch (error) {
        console.error("❌ Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };

    loadUserFromLocalStorage();
  }, []);

  // Function to set Authorization token globally
  const setAuthToken = (token) => {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // ✅ Signup function
  const signup = async (name, email, phone, password) => {
    try {
      const { data } = await API.post("/users/signup", {
        name,
        email,
        phone,
        password,
      });

      return { success: true, user: data.user };
    } catch (error) {
      console.error("❌ Signup error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // ✅ Improved Login function (Updated to match backend response)
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/users/login", { email, password });

      // ✅ Check the response structure for validity
      if (!data || !data.token || !data.userId) {
        console.error("❌ Invalid response structure:", data);
        return { success: false, message: "Invalid response from server" };
      }

      // Create user object based on response
      const user = { id: data.userId, email };

      // Set the user state and localStorage
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);

      // Set token in headers for future requests
      setAuthToken(data.token);

      return { success: true, user, token: data.token };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
