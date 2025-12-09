import React from "react";
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

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ShoppingCartSheet({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          background: "#111",
          color: "white",
          p: 2,
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Shopping Cart
        </Typography>

        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* EMPTY CART */}
      {cartItems.length === 0 ? (
        <Typography
          textAlign="center"
          sx={{ mt: 6, opacity: 0.7, fontSize: "1.1rem" }}
        >
          Your cart is empty 🛒
        </Typography>
      ) : (
        <>
          {/* CART ITEMS LIST */}
          <List sx={{ mt: 2 }}>
            {cartItems.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  mb: 2,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={item.image}
                    variant="rounded"
                    sx={{ width: 60, height: 80, mr: 1 }}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: "bold", color: "#ffa500" }}>
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        {item.author}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        ${item.price}
                      </Typography>
                    </>
                  }
                />

                {/* QUANTITY CONTROLS */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  mx={1}
                >
                  <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    sx={{ color: "#ffa500" }}
                  >
                    <AddIcon />
                  </IconButton>

                  <Typography sx={{ my: 0.5 }}>{item.quantity}</Typography>

                  <IconButton
                    size="small"
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    sx={{ color: "#ffa500" }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>

                {/* REMOVE ITEM */}
                <IconButton
                  onClick={() => onRemoveItem(item.id)}
                  sx={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>

          {/* PRICE SUMMARY */}
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal</Typography>
            <Typography>${subtotal.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Shipping</Typography>
            <Typography>${shipping.toFixed(2)}</Typography>
          </Box>

          <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" sx={{ color: "#ffa500" }}>
              ${total.toFixed(2)}
            </Typography>
          </Box>

          {/* CHECKOUT BUTTON */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              mt: 1,
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
