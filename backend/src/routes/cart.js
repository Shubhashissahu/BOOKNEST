import express from "express";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartQuantity,
  clearCart,         
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ✅ Route order is correct — specific routes before dynamic /:id
router.get("/",          protect, getCart);
router.post("/add",      protect, addToCart);
router.put("/:id",       protect, updateCartQuantity);
router.delete("/clear",  protect, clearCart);   // ← must stay ABOVE /:id
router.delete("/:id",    protect, removeCartItem);

export default router;