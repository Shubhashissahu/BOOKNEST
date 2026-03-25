import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cart";
import { toast } from "react-toastify";
import PaymentModal from "../Components/PaymentModal";
import ReceiptModal from "../Components/ReceiptModal";

export default function CheckoutPage({ onOrderPlaced }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const [address, setAddress] = useState({
    name: "", phone: "", street: "",
    city: "", state: "", pincode: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getCart(token).then((res) => setCartItems(res.data));
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.book?.price || 0) * item.quantity, 0
  );
  const shipping = subtotal > 0 ? 45 : 0;
  const handlingFee = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping + handlingFee;

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  // Validate address → open PaymentModal
  const handleProceed = () => {
    if (!address.name || !address.phone || !address.street || !address.city) {
      toast.error("Please fill all address fields");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setPaymentOpen(true); // ← open modal instead of placing order
  };

  // Called on successful payment
  const handlePaymentSuccess = (receiptData) => {
    setPaymentOpen(false);
    setReceipt(receiptData);   // show receipt modal
    onOrderPlaced?.();         // clear cart badge in navbar
  };

  // After closing receipt → go to orders
  const handleReceiptClose = () => {
    setReceipt(null);
    navigate("/orders");
  };

  // Build orderData to pass into PaymentModal
  const orderData = {
    items: cartItems.map((item) => ({
      bookId: item.book?._id,
      title: item.book?.title,
      author: item.book?.author,
      price: item.book?.price,
      image: item.book?.image,
      quantity: item.quantity,
    })),
    subtotal,
    shipping,
    handlingFee,
    total,
    address,
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3, color: "#fff" }}>
      <Typography variant="h3" fontWeight="bold" sx={{ color: "#ffa500", mb: 3 }}>
        Checkout
      </Typography>

      <Typography variant="h6" mb={2}>Delivery Address</Typography>
      {["name", "phone", "street", "city", "state", "pincode"].map((field) => (
        <TextField
          key={field}
          name={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={address[field]}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#aaa" } }}
        />
      ))}

      <Divider sx={{ my: 2, borderColor: "#333" }} />

      <Typography variant="h6" mb={2}>Order Summary</Typography>

      {cartItems.length === 0 && (
        <Typography sx={{ opacity: 0.6 }}>No items in cart.</Typography>
      )}

      {cartItems.map((item, i) => (
        <Box key={i} display="flex" justifyContent="space-between" mb={1}>
          <Typography>{item.book?.title} x{item.quantity}</Typography>
          <Typography>₹{((item.book?.price || 0) * item.quantity).toFixed(2)}</Typography>
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

      {/* ✅ Changed from "Place Order (COD)" to "Proceed to Payment" */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          background: "linear-gradient(90deg,#ffa500,#ff5e00)",
          borderRadius: "30px",
          py: 1.5,
          fontWeight: "bold",
        }}
        onClick={handleProceed}
      >
        Proceed to Payment →
      </Button>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        orderData={orderData}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Modal */}
      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={handleReceiptClose}
        />
      )}
    </Box>
  );
}