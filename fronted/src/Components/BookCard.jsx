import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const BookCard = ({ book, onViewDetails, onAddToCart }) => {
  return (
    <Card
      sx={{
        height: "100%", // ⭐ equal height in grid
        display: "flex",
        flexDirection: "column",
        background: "#111",
        color: "#fff",
        borderRadius: 3,
        overflow: "hidden",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        component="img"
        src={book.cover}
        alt={book.title}
        sx={{
          width: "100%",
          height: 240,
          objectFit: "cover",
        }}
      />

      {/* CONTENT */}
      <CardContent
        sx={{
          flexGrow: 1, // ⭐ fills remaining space
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {book.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>
          by {book.author}
        </Typography>

        {/* ⭐ Rating */}
        <Typography sx={{ color: "#ffb91f", mb: 1 }}>
          {"★".repeat(Math.floor(book.rating))}
          {"☆".repeat(5 - Math.floor(book.rating))}
          <span style={{ marginLeft: 6 }}>({book.rating})</span>
        </Typography>

        <Typography
          sx={{
            color: "#00e676",
            fontSize: "1.1rem",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          ₹{book.price}
        </Typography>

        {/* ACTIONS – pinned to bottom */}
        <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(90deg,#ffa500,#ff5e00)",
              borderRadius: "30px",
            }}
            onClick={() => onViewDetails(book)}
          >
            View Details
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              color: "#ffa500",
              borderColor: "#ffa500",
              borderRadius: "30px",
              "&:hover": {
                borderColor: "#ff7b00",
                color: "#ff7b00",
              },
            }}
            onClick={() => onAddToCart(book)}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard;
