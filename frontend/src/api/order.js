//frontend/src/api/Orders.js
import axios from "axios";

// ✅ FIX #2 — env variable
const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`;

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const placeOrder  = (data, token) =>
  axios.post(`${BASE}/place`, data, authHeaders(token));

export const getMyOrders = (token) =>
  axios.get(`${BASE}/my`, authHeaders(token));