import Order from "../models/Order.js";
import Cart from "../models/cart.js";

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;

    const order = await Order.create({
      user: req.user,
      items,
      totalAmount,
      address,
      paymentMethod,
    });

    // Clear cart after order
    await Cart.deleteMany({ user: req.user });

    res.json({ message: "Order placed!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};