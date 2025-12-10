import axios from 'axios';
import { getAuth } from 'firebase/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function authHeader() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return {};
    const token = await user.getIdToken(true);
    return { Authorization: `Bearer ${token}` };
  } catch (e) { return {}; }
}

export async function getBooks(query = {}) {
  const q = new URLSearchParams(query).toString();
  const res = await axios.get(`${baseURL}/api/books?${q}`);
  return res.data;
}

export async function getBook(id) {
  const res = await axios.get(`${baseURL}/api/books/${id}`);
  return res.data;
}

export async function placeOrder(payload) {
  const headers = await authHeader();
  const res = await axios.post(`${baseURL}/api/orders`, payload, { headers });
  return res.data;
}

export async function syncUser() {
  const headers = await authHeader();
  const res = await axios.post(`${baseURL}/api/auth/sync`, {}, { headers });
  return res.data;
}

export async function getMyOrders() {
  const headers = await authHeader();
  const res = await axios.get(`${baseURL}/api/orders/my`, { headers });
  return res.data;
}

export default { getBooks, getBook, placeOrder, syncUser, getMyOrders };
