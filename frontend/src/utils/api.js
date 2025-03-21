import axios from "axios";

// Create axios instance with a base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api",  // Ensure the base URL is correctly set
  headers: { "Content-Type": "application/json" },
  timeout: process.env.REACT_APP_API_TIMEOUT || 10000, // Set a timeout of 10 seconds for API requests to avoid hanging
});

// Add request interceptor to include the token in headers
API.interceptors.request.use((config) => {
  // Try to get the token from localStorage
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach the token to the request header if available
  }

  return config;
}, (error) => {
  return Promise.reject(error);  // In case of error, reject the promise
});

// Add response interceptor to handle errors globally and refresh the token
API.interceptors.response.use(
  (response) => response,  // Pass the successful response as is
  async (error) => {
    // Handle errors globally based on the error response status
    if (error.response) {
      if (error.response.status === 401) {
        // If unauthorized, try refreshing the token
        try {
          const refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken) {
            // Try to get a new access token using the refresh token
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api"}/auth/refresh-token`, { refreshToken });

            // Save the new access token in localStorage
            localStorage.setItem("token", response.data.token);

            // Retry the original request with the new token
            error.config.headers.Authorization = `Bearer ${response.data.token}`;
            return axios(error.config); // Retry the original request
          }
        } catch (refreshError) {
          // If refreshing the token fails, log out the user
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          alert("Session expired. Please log in again.");
          window.location.href = "/login"; // Redirect to login page
        }
      } else if (error.response.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(`Error: ${error.response.data.message || error.message}`);
      }
    } else if (error.request) {
      // No response received from server (e.g., network error)
      alert("Network error. Please check your internet connection.");
    } else {
      // General error (something went wrong with the request)
      alert(`Error: ${error.message}`);
    }
    return Promise.reject(error); // Reject the promise to allow the calling code to handle the error
  }
);

export default API;
