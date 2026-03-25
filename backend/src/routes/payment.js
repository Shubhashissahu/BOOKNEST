import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js'; // ← ADD THIS

const router = express.Router();

router.post('/process', protect, processPayment); // ← ADD protect here

export default router;