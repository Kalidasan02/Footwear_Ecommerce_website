import axios from "axios";

const API = axios.create({
  // Vite uses import.meta.env instead of process.env
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;