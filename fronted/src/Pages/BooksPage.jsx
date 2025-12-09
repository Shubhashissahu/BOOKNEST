import React, { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { books } from "../data/booksData";
import BookCard from "../Components/BookCard";
import BookDetailModal from "../Components/BookDetailModal";

const BooksPage = ({ cart, setCart }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleAddToCart = (book) => {
    setCart([...cart, { ...book, quantity: 1 }]);
  };

  return (
    <Box sx={{ py: 5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#ffa500",
          mb: 3,
          textAlign: "center",
        }}
      >
        Browse Books
      </Typography>

      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <BookCard
              book={book}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid>

      <BookDetailModal
        open={modalOpen}
        book={selectedBook}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </Box>
  );
};

export default BooksPage;
