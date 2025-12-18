import axios from "axios";
import { getAuth } from "firebase/auth";
import firebaseApp from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // make sure this ends with /api
});

// Interceptor to attach Firebase ID token
axiosSecure.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (user) {
        
        const token = await user.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (err) {
      console.error("Axios Secure Interceptor error:", err);
      return config; 
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosSecure;
