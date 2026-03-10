import React, { useMemo } from "react";
// import axios from "axios";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function ShoppingCartSheet({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
//price claculation
const subtotal = useMemo(() =>
    cartItems.reduce(
      (sum, item) => sum + (item.book?.price || 0) * item.quantity,
      0
    ),
  [cartItems]
);
  const shipping = subtotal > 0 ? 45 : 0; 
  const handlingfee = subtotal>0?15:0;
  const total = subtotal + shipping + handlingfee;

  //navigate
const navigate = useNavigate();

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
      {/* ================= HEADER ================= */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Shopping Cart
        </Typography>

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* ================= EMPTY CART ================= */}
      {cartItems.length === 0 ? (
        <Typography
          textAlign="center"
          sx={{ mt: 6, opacity: 0.7, fontSize: "1.1rem" }}
        >
          Your cart is empty 🛒
        </Typography>
      ) : (
        <>
          {/* ================= CART ITEMS ================= */}
          <List sx={{ mt: 2 }}>
            {cartItems.map((item) => (
              <ListItem
                key={item._id}
                sx={{
                  mb: 2,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={item.book?.image}
                    variant="rounded"
                    sx={{ width: 60, height: 80, mr: 1 }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/60x80/222/ffa500?text=No+Cover";
                    }}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography
                      sx={{ fontWeight: "bold", color: "#ffa500" }}
                      noWrap
                    >
                      {item.book?.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        {item.book?.author}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{item.book?.price}
                      </Typography>
                    </>
                  }
                />
                {/* ================= QUANTITY ================= */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mx={1}
                >
                  <IconButton
                    size="small"
                    sx={{ color: "#ffa500" }}
                    onClick={() =>
                    onUpdateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    <AddIcon />
                  </IconButton>

                  <Typography sx={{ my: 0.5 }}>
                    {item.quantity}
                  </Typography>

                  <IconButton
                    size="small"
                    sx={{ color: "#ffa500" }}
                    disabled={item.quantity === 1}
                    onClick={() =>
                    onUpdateQuantity(item._id, item.quantity - 1)
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>

                {/* ================= REMOVE ITEM ================= */}
                <IconButton
                  onClick={() => {
                    onRemoveItem(item._id);
                    toast.error("Item removed from cart");
                  }}
                  sx={{ color: "#ff5252" }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>

          {/* ================= SUMMARY ================= */}
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal</Typography>
            <Typography>₹{subtotal.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Shipping</Typography>
            <Typography>₹{shipping.toFixed(2)}</Typography>
          </Box>
           <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Handeling fee</Typography>
            <Typography>₹{handlingfee.toFixed(2)}</Typography>
          </Box>

          <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" sx={{ color: "#ffa500" }}>
              ₹{total.toFixed(2)}
            </Typography>
          </Box>

          {/* ================= CHECKOUT ================= */}
          <Button
            fullWidth
            variant="contained"
          onClick={() => { onClose(); navigate("/checkout"); }}
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
