import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      bookId:  String,
      title:   String,
      author:  String,
      price:   Number,
      image:   String,
      quantity: Number,
    }
  ],
  totalAmount:  { type: Number },
  address: {
    name:    String,
    phone:   String,
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
  },
  paymentMethod: { type: String, default: "COD" }, 
 paymentStatus: {
  type: String,
  enum: ['PENDING', 'PAID'],
  default: 'PENDING',
},
transactionId: {
  type: String,
  default: null,
},
  orderStatus:   { type: String, default: "Processing" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);