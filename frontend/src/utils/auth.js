// src/utils/auth.js

export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user)); //  Save BOTH
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null; // Corrupted data? Return null safely
  }
};

export const getToken = () => localStorage.getItem("token");

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};