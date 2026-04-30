//backend/src/controller/ordercontroller
import Order from "../models/Order.js";
import Cart  from "../models/cart.js";

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;

    // ✅ Validate required fields
    if (!items?.length || !totalAmount || !address || !paymentMethod)
      return res.status(400).json({ message: "Missing required order fields" });

    const order = await Order.create({
      user: req.user._id,  // ✅ FIX — use ._id
      items,
      totalAmount,
      address,
      paymentMethod,
    });

    // ✅ FIX — use ._id for cart cleanup
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json({ message: "Order placed!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    // ✅ FIX — use ._id
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};