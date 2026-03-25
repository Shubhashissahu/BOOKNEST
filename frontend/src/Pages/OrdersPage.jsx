import React, { useEffect, useState } from "react";
import {
  Box, Typography, Chip, Divider, Button, Stack
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { getMyOrders } from "../api/order";
import PaymentModal from "../Components/PaymentModal";
import ReceiptModal from "../Components/ReceiptModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);   // order being paid
  const [receipt, setReceipt] = useState(null);               // receipt to show
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getMyOrders(token)
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  // Called when payment succeeds — update order in local state
  const handlePaymentSuccess = (receiptData, paidOrderId) => {
    setOrders(prev =>
      prev.map(o =>
        o._id === paidOrderId
          ? { ...o, paymentStatus: 'PAID', orderStatus: 'Processing' }
          : o
      )
    );
    setReceipt(receiptData);
  };

  const statusColor = (status) => {
    if (status === "Processing") return "warning";
    if (status === "Delivered") return "success";
    return "default";
  };

  const paymentColor = (status) =>
    status === 'PAID' ? 'success' : 'error';

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3, color: "#fff" }}>
      <Typography variant="h3" fontWeight="bold" sx={{ color: "#ffa500", mb: 3 }}>
        My Orders
      </Typography>

      {orders.length === 0 && (
        <Typography sx={{ opacity: 0.6 }}>No orders yet.</Typography>
      )}

      {orders.map((order) => (
        <Box
          key={order._id}
          sx={{ background: "#1a1a1a", borderRadius: 2, p: 2, mb: 3 }}
        >
          {/* Order Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            <Stack direction="row" spacing={1}>
              {/* Payment Status Badge */}
              <Chip
                label={order.paymentStatus || 'PENDING'}
                color={paymentColor(order.paymentStatus)}
                size="small"
                variant="outlined"
              />
              {/* Order Status Badge */}
              <Chip
                label={order.orderStatus}
                color={statusColor(order.orderStatus)}
                size="small"
              />
            </Stack>
          </Box>

          <Divider sx={{ borderColor: "#333", mb: 1 }} />

          {/* Order Items */}
          {order.items?.map((item, i) => (
            <Box key={i} display="flex" justifyContent="space-between" mb={0.5}>
              <Typography>
                {item.title || "Book"} x{item.quantity}
              </Typography>
              <Typography>
                ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ borderColor: "#333", my: 1 }} />

          {/* Total + Pay Now Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack>
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold" sx={{ color: "#ffa500" }}>
                ₹{order.totalAmount?.toFixed(2)}
              </Typography>
            </Stack>

            {/* ✅ Show Pay Now only if NOT already paid */}
            {order.paymentStatus !== 'PAID' && (
              <Button
                variant="contained"
                color="warning"
                startIcon={<PaymentIcon />}
                onClick={() => setSelectedOrder(order)}
                sx={{ fontWeight: 700 }}
              >
                Pay Now
              </Button>
            )}

            {/* ✅ Show transaction ID if already paid */}
            {order.paymentStatus === 'PAID' && order.transactionId && (
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                TXN: {order.transactionId}
              </Typography>
            )}
          </Box>
        </Box>
      ))}

      {/* Payment Modal */}
      <PaymentModal
  open={!!selectedOrder}
  onClose={() => setSelectedOrder(null)}
  orderData={{                 // ← build orderData shape PaymentModal needs
    items: selectedOrder?.items || [],
    total: selectedOrder?.totalAmount,
    shipping: 45,               // already paid shipping at checkout
    handlingFee: 15,
    address: selectedOrder?.address,
  }}
  onSuccess={(receiptData) => handlePaymentSuccess(receiptData, selectedOrder?._id)}
/>

      {/* Receipt Modal after successful payment */}
      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </Box>
  );
}
