import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  book: {
    id: String,
    title: String,
    author: String,
    price: Number,
    image: String
  },

  quantity: {
    type: Number,
    default: 1
  }

}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);