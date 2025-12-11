// src/services/api.js
import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL;

// Firebase Auth instance
const auth = getAuth(app);

// ------------------------------------------------------
// PUBLIC axios instance
// ------------------------------------------------------
const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

// ------------------------------------------------------
// SECURE axios instance (JWT attached automatically)
// ------------------------------------------------------
const axiosSecure = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token
axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: error handler
axiosSecure.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized — JWT missing or expired");
    }
    return Promise.reject(err);
  }
);

// ------------------------------------------------------
// 📚 API FUNCTIONS
// ------------------------------------------------------

// Get all books (public)
export const getBooks = async () => {
  const res = await axiosPublic.get("/books");
  return res.data;
};

// Get single book
export const getBookById = async (id) => {
  const res = await axiosPublic.get(`/books/${id}`);
  return res.data;
};

// Add book (secure)
export const addBook = async (bookData) => {
  const res = await axiosSecure.post("/books", bookData);
  return res.data;
};

// Delete book (secure)
export const deleteBook = async (id) => {
  const res = await axiosSecure.delete(`/books/${id}`);
  return res.data;
};

// Update book (secure)
export const updateBook = async (id, data) => {
  const res = await axiosSecure.put(`/books/${id}`, data);
  return res.data;
};

// ------------------------------------------------------
// Export axios instances too (optional)
// ------------------------------------------------------
export const api = {
  public: axiosPublic,
  secure: axiosSecure,
};
