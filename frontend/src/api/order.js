import axios from "axios";

const BASE = "http://localhost:5000/api/orders";

export const placeOrder  = (data, token) =>
  axios.post(`${BASE}/place`, data, { headers: { Authorization: `Bearer ${token}` } });

export const getMyOrders = (token) =>
  axios.get(`${BASE}/my`, { headers: { Authorization: `Bearer ${token}` } });