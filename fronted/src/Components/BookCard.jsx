import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

/**
 * BookCard
 * Props:
 * - book: { id, title, author, image, price }
 * - onViewDetails(book)
 * - onAddToCart(book)
 */

const BookCard = ({ book, onViewDetails, onAddToCart }) => {
  // ⭐ Open Library has no ratings → generate safe fake rating (4–5)
  const rating = book.rating ?? Math.floor(Math.random() * 2) + 4;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111",
        color: "#fff",
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* ================= IMAGE ================= */}
      <Box
        component="img"
        src={book.image}
        alt={book.title}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x450?text=No+Cover";
        }}
        sx={{
          width: "100%",
          height: 200,          // ⭐ keeps cards compact
          objectFit: "cover",
          backgroundColor: "#222",
        }}
      />

      {/* ================= CONTENT ================= */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Title */}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {book.title}
        </Typography>

        {/* Author */}
        <Typography
          variant="body2"
          sx={{ color: "#bbb", mb: 1 }}
        >
          by {book.author}
        </Typography>

        {/* Rating */}
        <Typography sx={{ color: "#ffb91f", fontSize: "14px", mb: 1 }}>
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
          <span style={{ marginLeft: 6 }}>({rating}.0)</span>
        </Typography>

        {/* Price */}
        <Typography
          sx={{
            color: "#00e676",
            fontWeight: "bold",
            fontSize: "1rem",
            mb: 2,
          }}
        >
          ₹{book.price}
        </Typography>

        {/* ================= ACTIONS ================= */}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(90deg,#ffa500,#ff5e00)",
              borderRadius: "24px",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(90deg,#ff5e00,#ffa500)",
              },
            }}
            onClick={() => onViewDetails(book)}
          >
            View Details
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: "24px",
              color: "#ffa500",
              borderColor: "#ffa500",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#ff7b00",
                color: "#ff7b00",
                backgroundColor: "rgba(255,165,0,0.08)",
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
