import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";

const BookCard = ({ book, onViewDetails, onAddToCart }) => {
  return (
    <Card
      sx={{
        background: "#111",
        color: "#fff",
        borderRadius: 3,
        overflow: "hidden",
        p: 2,
        transition: "0.3s",
        "&:hover": { transform: "translateY(-8px)", boxShadow: "0 8px 25px rgba(0,0,0,0.5)" },
      }}
    >
      <Box
        component="img"
        src={book.cover}
        alt={book.title}
        sx={{
          width: "100%",
          height: 250,
          objectFit: "cover",
          borderRadius: 2,
        }}
      />

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
          {book.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>
          by {book.author}
        </Typography>

        {/* ⭐ Rating */}
        <Typography sx={{ color: "#ffb91f", mb: 1 }}>
          {"★".repeat(Math.floor(book.rating))}
          {"☆".repeat(5 - Math.floor(book.rating))}
          <span style={{ marginLeft: 5 }}>({book.rating})</span>
        </Typography>

        <Typography sx={{ color: "#00e676", fontSize: "1.2rem", mb: 2 }}>
          ₹{book.price}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(90deg,#ffa500,#ff5e00)",
            mb: 1,
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
            "&:hover": { borderColor: "#ff7b00", color: "#ff7b00" },
          }}
          onClick={() => onAddToCart(book)}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
