import React, { useMemo, useState } from "react";
import {
  Drawer, Box, Typography, IconButton, Divider,
  Button, List, ListItem, ListItemText, ListItemAvatar, Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon  from "@mui/icons-material/Close";
import AddIcon    from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function ShoppingCartSheet({
  isOpen,
  onClose,
  cartItems = [],   // ✅ FIX #1 — default to empty array
  onUpdateQuantity,
  onRemoveItem,
}) {
  const navigate = useNavigate();

  // ✅ FIX #8 — per-item loading state
  const [loadingItems, setLoadingItems] = useState({});

  // ✅ FIX #2 — all price calculations in one memoized block
  const { subtotal, shipping, handlingFee, total } = useMemo(() => {
    const subtotal    = cartItems.reduce(
      (sum, item) => sum + (item.book?.price || 0) * item.quantity, 0
    );
    const shipping    = subtotal > 0 ? 45  : 0;
    const handlingFee = subtotal > 0 ? 15  : 0;
    return { subtotal, shipping, handlingFee, total: subtotal + shipping + handlingFee };
  }, [cartItems]);

  const handleUpdateQuantity = async (id, qty) => {
    // ✅ FIX #3 — hard guard against going below 1
    if (qty < 1) return;
    setLoadingItems(prev => ({ ...prev, [id]: true }));
    try {
      await onUpdateQuantity(id, qty);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRemove = async (id) => {
    setLoadingItems(prev => ({ ...prev, [id]: true }));
    try {
      // ✅ FIX #4 — await before toasting
      await onRemoveItem(id);
      toast.info("Item removed from cart"); // ✅ FIX #5 — correct severity
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setLoadingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 380 },
          background: "#111",
          color: "#fff",
          p: 2,
        },
      }}
    >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Shopping Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* EMPTY STATE */}
      {cartItems.length === 0 ? (
        <Typography textAlign="center" sx={{ mt: 6, opacity: 0.7, fontSize: "1.1rem" }}>
          Your cart is empty 🛒
        </Typography>
      ) : (
        <>
          {/* CART ITEMS */}
          <List sx={{ mt: 2 }}>
            {cartItems.map((item) => {
              const isItemLoading = loadingItems[item._id];
              return (
                <ListItem
                  key={item._id}
                  sx={{
                    mb: 2,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 2,
                    opacity: isItemLoading ? 0.5 : 1, // ✅ FIX #8 — visual feedback
                    transition: "opacity 0.2s",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={item.book?.image}
                      variant="rounded"
                      sx={{ width: 60, height: 80, mr: 1 }}
                      onError={(e) => {
                        // ✅ FIX #9 — inline fallback, no external URL
                        e.target.style.display = "none";
                      }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "bold", color: "#ffa500" }} noWrap>
                        {item.book?.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ opacity: 0.6 }}>
                          {item.book?.author}
                        </Typography>
                        {/* ✅ FIX #7 — toFixed(2) on price */}
                        <Typography variant="body2" fontWeight="bold">
                          ₹{(item.book?.price || 0).toFixed(2)}
                        </Typography>
                      </>
                    }
                  />

                  {/* QUANTITY CONTROLS */}
                  <Box display="flex" flexDirection="column" alignItems="center" mx={1}>
                    <IconButton
                      size="small"
                      sx={{ color: "#ffa500" }}
                      disabled={isItemLoading}
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>

                    <Typography sx={{ my: 0.5 }}>{item.quantity}</Typography>

                    <IconButton
                      size="small"
                      sx={{ color: "#ffa500" }}
                      // ✅ FIX #3 — disabled at 1 AND guarded in handler
                      disabled={item.quantity === 1 || isItemLoading}
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>

                  {/* REMOVE */}
                  <IconButton
                    onClick={() => handleRemove(item._id)}
                    disabled={isItemLoading}
                    sx={{ color: "#ff5252" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>

          {/* SUMMARY */}
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal</Typography>
            <Typography>₹{subtotal.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Shipping</Typography>
            <Typography>₹{shipping.toFixed(2)}</Typography>
          </Box>
          {/* ✅ FIX #6 — typo fixed */}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Handling Fee</Typography>
            <Typography>₹{handlingFee.toFixed(2)}</Typography>
          </Box>

          <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" sx={{ color: "#ffa500" }}>
              ₹{total.toFixed(2)}
            </Typography>
          </Box>

          {/* CHECKOUT */}
          <Button
            fullWidth
            variant="contained"
            // ✅ FIX #10 — guard against empty cart navigation
            onClick={() => {
              if (cartItems.length === 0) return;
              onClose();
              navigate("/checkout");
            }}
            sx={{
              py: 1.5,
              background: "linear-gradient(90deg,#ffa500,#ff5e00)",
              fontWeight: "bold",
              borderRadius: "30px",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Drawer>
  );
}