import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { getMyOrders } from "../api/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  // Fetch orders
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getMyOrders(token)
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });
  }, []);

  const statusColor = (status) => {
    if (status === "Processing") return "warning";
    if (status === "Delivered") return "success";
    return "default";
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3, color: "#fff" }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ color: "#ffa500", mb: 3 }}
      >
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
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Typography>

            <Chip
              label={order.orderStatus}
              color={statusColor(order.orderStatus)}
              size="small"
            />
          </Box>

          <Divider sx={{ borderColor: "#333", mb: 1 }} />

          {/* Order Items */}
          {order.items?.map((item, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              mb={0.5}
            >
              <Typography>
                {item.title || "Book"} x{item.quantity}
              </Typography>

              <Typography>
                ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ borderColor: "#333", my: 1 }} />

          {/* Total */}
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Total</Typography>

            <Typography fontWeight="bold" sx={{ color: "#ffa500" }}>
              ₹{order.totalAmount?.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}