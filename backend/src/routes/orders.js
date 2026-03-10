import express from "express";
import { placeOrder, getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.get("/my", protect, getMyOrders);
export default router;