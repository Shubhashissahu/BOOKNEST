import express from "express";
import { addToCart, getCart, removeCartItem,updateCartQuantity } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";
import { clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.post("/add", protect, addToCart);
router.put("/:id", protect, updateCartQuantity); 
router.get("/", protect, getCart);
router.delete('/clear', protect, clearCart); 
router.delete("/:id", protect, removeCartItem);

export default router;