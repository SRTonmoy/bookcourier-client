
import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";



const auth = getAuth(app);


const axiosPublic = axios.create({
  baseURL: BASE_URL,
});


const axiosSecure = axios.create({
  baseURL: BASE_URL,
});


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


axiosSecure.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized — JWT missing or expired");
    }
    return Promise.reject(err);
  }
);


export const getBooks = async () => {
  const res = await axiosPublic.get("/books");
  return res.data;
};


export const getBookById = async (id) => {
  const res = await axiosPublic.get(`/books/${id}`);
  return res.data;
};


export const addBook = async (bookData) => {
  const res = await axiosSecure.post("/books", bookData);
  return res.data;
};


export const deleteBook = async (id) => {
  const res = await axiosSecure.delete(`/books/${id}`);
  return res.data;
};


export const updateBook = async (id, data) => {
  const res = await axiosSecure.put(`/books/${id}`, data);
  return res.data;
};


export const api = {
  public: axiosPublic,
  secure: axiosSecure,
};
