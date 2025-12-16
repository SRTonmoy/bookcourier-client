import axios from "axios";
import { getAuth } from "firebase/auth";
import firebaseApp from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

axiosSecure.interceptors.request.use(async (config) => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosSecure;
