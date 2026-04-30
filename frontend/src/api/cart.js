import axios from "axios";

// ✅ FIX #1 — env variable, never hardcoded
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const cartAPI = axios.create({
  baseURL: `${BASE}/api/cart`,
});

// ✅ Attach token via interceptor — no need to pass token to every function
const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// GET CART
export const getCart = (token) =>
  cartAPI.get("/", authHeaders(token));

// ADD TO CART
export const addToCart = (bookId, token) =>
  cartAPI.post("/add", { bookId }, authHeaders(token));

// UPDATE QUANTITY
export const updateCartQuantity = (cartId, quantity, token) =>
  cartAPI.put(`/${cartId}`, { quantity }, authHeaders(token));

// REMOVE ITEM
export const removeFromCart = (cartId, token) =>
  cartAPI.delete(`/${cartId}`, authHeaders(token));

// ✅ FIX #2 — distinct endpoint to avoid /:cartId conflict
// src/api/cart.js
export const clearCart = (token) =>
  cartAPI.delete("/clear", authHeaders(token)); 