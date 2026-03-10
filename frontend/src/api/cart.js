import axios from "axios";

const API = "http://localhost:5000/api/cart";

// GET CART
export const getCart = (token) =>
  axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ADD TO CART
export const addToCart = (bookId, token) =>
  axios.post(
    `${API}/add`,
    { bookId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// UPDATE QUANTITY
export const updateCartQuantity = (cartId, quantity, token) =>
  axios.put(
    `${API}/${cartId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// REMOVE ITEM
export const removeFromCart = (cartId, token) =>
  axios.delete(`${API}/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });