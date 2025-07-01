import axios from "axios";

const api = axios.create({
  baseURL: "https://travel-itinerary-backend-6j4k.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Extract backend error message from common Django REST formats
      const backendError = 
        error.response.data?.detail ||
        error.response.data?.message ||
        error.response.data?.error ||
        error.message;
      
      return Promise.reject(new Error(backendError));
    }
    return Promise.reject(error);
  }
);

export default api;