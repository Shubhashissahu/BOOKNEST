import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/order";
import { getCart } from "../api/cart";
import { toast } from "react-toastify";

export default function CheckoutPage({ onOrderPlaced }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Fetch cart
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCart(token).then((res) => setCartItems(res.data));
  }, []);

  // Price calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.book?.price || 0) * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 45 : 0;
  const handlingFee = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping + handlingFee;

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.street || !address.city) {
      toast.error("Please fill all address fields");
      return;
    }

    const token = localStorage.getItem("token");

    const items = cartItems.map((item) => ({
      bookId: item.book?._id,
      title: item.book?.title,
      author: item.book?.author,
      price: item.book?.price,
      image: item.book?.image,
      quantity: item.quantity,
    }));

    try {
      await placeOrder(
        {
          items,
          totalAmount: total,
          address,
          paymentMethod: "COD",
        },
        token
      );

      toast.success("Order placed successfully! 🎉");

      onOrderPlaced();
      navigate("/orders");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3, color: "#fff" }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ color: "#ffa500", mb: 3 }}
      >
        Checkout
      </Typography>

      {/* Address */}
      <Typography variant="h6" mb={2}>
        Delivery Address
      </Typography>

      {["name", "phone", "street", "city", "state", "pincode"].map((field) => (
        <TextField
          key={field}
          name={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={address[field]}
          onChange={handleChange}
          fullWidth
          sx={{
            mb: 2,
            input: { color: "#fff" },
            label: { color: "#aaa" },
          }}
        />
      ))}

      <Divider sx={{ my: 2, borderColor: "#333" }} />

      {/* Order Summary */}
      <Typography variant="h6" mb={2}>
        Order Summary
      </Typography>

      {cartItems.length === 0 && (
        <Typography sx={{ opacity: 0.6 }}>No items in cart.</Typography>
      )}

      {cartItems.map((item, i) => (
        <Box key={i} display="flex" justifyContent="space-between" mb={1}>
          <Typography>
            {item.book?.title} x{item.quantity}
          </Typography>

          <Typography>
            ₹{((item.book?.price || 0) * item.quantity).toFixed(2)}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2, borderColor: "#333" }} />

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Subtotal</Typography>
        <Typography>₹{subtotal.toFixed(2)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Shipping</Typography>
        <Typography>₹{shipping.toFixed(2)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Handling Fee</Typography>
        <Typography>₹{handlingFee.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#333" }} />

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" sx={{ color: "#ffa500" }}>
          ₹{total.toFixed(2)}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          background: "linear-gradient(90deg,#ffa500,#ff5e00)",
          borderRadius: "30px",
          py: 1.5,
          fontWeight: "bold",
        }}
        onClick={handlePlaceOrder}
      >
        Place Order (Cash on Delivery)
      </Button>
    </Box>
  );
}