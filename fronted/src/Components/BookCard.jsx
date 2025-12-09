import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Rating,
} from "@mui/material";

export default function BookCardMUI({ book, onView }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: "#111",
        color: "white",
        boxShadow: "0 4px 25px rgba(0,0,0,0.4)",
        transition: "0.3s",
        "&:hover": { transform: "translateY(-6px)", boxShadow: "0 8px 30px black" },
      }}
    >
      <CardMedia
        component="img"
        image={book.cover}
        alt={book.title}
        sx={{ height: 260 }}
      />

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {book.title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
          by {book.author}
        </Typography>

        <Rating value={book.rating} precision={0.5} readOnly sx={{ mb: 1 }} />

        <Typography variant="h6" sx={{ color: "#4ade80", mb: 2 }}>
          ₹{book.price}
        </Typography>

        <Button
          variant="contained"
          onClick={() => onView(book)}
          fullWidth
          sx={{
            background: "linear-gradient(90deg,#ffa500,#ff5e00)",
            borderRadius: "12px",
            fontWeight: "bold",
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
