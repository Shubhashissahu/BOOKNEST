import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  paymentMethod: { type: String }, // e.g., "Visa ending in 4242"
  status: { type: String, default: 'SUCCESS' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);