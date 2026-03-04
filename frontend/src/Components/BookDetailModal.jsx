import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box
} from "@mui/material";
import BookReader from "./BookReader"; // ✅ IMPORTANT: import reader

const BookDetailModal = ({ open, book, onClose, onAddToCart }) => {
  const [readerOpen, setReaderOpen] = useState(false); // ✅ MUST be inside component

  if (!book) return null;

  return (
    <>
      {/* 🔥 MAIN BOOK DETAILS MODAL */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          {book.title}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            <img
              src={book.cover}
              alt={book.title}
              style={{
                width: "220px",
                borderRadius: "10px",
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Author: {book.author}</Typography>
              <Typography mt={1}><strong>Category:</strong> {book.category}</Typography>
              <Typography mt={1}><strong>Pages:</strong> {book.pages}</Typography>
              <Typography mt={1}><strong>Rating:</strong> ⭐ {book.rating}</Typography>

              <Typography mt={2}>{book.description}</Typography>

              {/* ADD TO CART */}
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                }}
                onClick={() => onAddToCart(book)}
              >
                Add to Cart – ₹{book.price}
              </Button>

              {/* OPEN PDF READER */}
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setReaderOpen(true)}
              >
                Read Preview
              </Button>
            </Box>
          </Box>

          {/* OLD IFRAME (OPTIONAL, you can remove this because BookReader is better) */}
          <Typography variant="h6" mb={1}>Preview</Typography>

          <iframe
            src={book.pdfUrl}
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "10px",
              border: "1px solid #333",
            }}
          ></iframe>
        </DialogContent>
      </Dialog>

      {/* 🔥 FULLSCREEN PDF READER MODAL */}
      <BookReader
        open={readerOpen}
        book={book}
        onClose={() => setReaderOpen(false)}
      />
    </>
  );
};

export default BookDetailModal;
