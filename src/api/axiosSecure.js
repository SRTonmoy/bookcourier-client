import axios from 'axios'
import jwt_decode from 'jwt-decode'

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
})

axiosSecure.interceptors.request.use(config => {
  const token = localStorage.getItem('access-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default axiosSecure