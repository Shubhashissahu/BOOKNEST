import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import BookCard from "../Components/BookCard";
import BookDetailModal from "../Components/BookDetailModal";
import openLibraryApi from "../Services/openLibrary";

const BooksPage = ({ cart, setCart }) => {
  const [query, setQuery] = useState("harry potter");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ===============================
     Normalize Open Library data
  =============================== */
  const normalizeBook = (doc) => {
    const coverId = doc.cover_i;

    return {
      id: doc.key?.replace("/works/", ""),
      title: doc.title || "Untitled",
      author: doc.author_name?.join(", ") || "Unknown",
      image: coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/300x450?text=No+Cover",
      price: Math.floor(Math.random() * 500) + 200,
      raw: doc,
    };
  };

  /* ===============================
     Fetch books
  =============================== */
  const fetchBooks = async (newPage = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const data = await openLibraryApi.searchBooks(query, newPage);
      const formatted = (data.docs || []).map(normalizeBook);
      setBooks(formatted);
      setPage(newPage);
    } catch (error) {
      console.error("Open Library Error:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     Initial load
  =============================== */
  useEffect(() => {
    fetchBooks(1);
  }, []);

  /* ===============================
     Cart logic
  =============================== */
  const handleAddToCart = (book) => {
    const exists = cart.find((item) => item.id === book.id);

    if (exists) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...book, quantity: 1 }]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 2,          // ✅ reduced top padding (no gap)
        pb: 4,
        px: 2,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95))",
      }}
    >
      <Box sx={{ maxWidth: "1300px", mx: "auto" }}>
        {/* ================= HEADER ================= */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#ffa500",
            textAlign: "center",
            mb: 2,
          }}
        >
          Browse Books
        </Typography>

        {/* ================= SEARCH ================= */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBooks(1)}
            placeholder="Search books..."
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "#ffa500", mr: 1 }} />
              ),
            }}
            sx={{
              width: 260,
              backgroundColor: "#111",
              borderRadius: 1,
            }}
          />

          <Button
            variant="contained"
            color="warning"
            disabled={loading}
            onClick={() => fetchBooks(1)}
          >
            {loading ? <CircularProgress size={20} /> : "Search"}
          </Button>
        </Box>

        {/* ================= LOADING ================= */}
        {loading && books.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#ffa500" }} />
          </Box>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && books.length === 0 && (
          <Typography sx={{ textAlign: "center", color: "#aaa", mt: 4 }}>
            No books found
          </Typography>
        )}

        {/* ================= BOOK GRID ================= */}
        <Grid container spacing={3} alignItems="stretch">
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <BookCard
                book={book}
                onViewDetails={() => {
                  setSelectedBook(book);
                  setModalOpen(true);
                }}
                onAddToCart={() => handleAddToCart(book)}
              />
            </Grid>
          ))}
        </Grid>

        {/* ================= PAGINATION ================= */}
        {books.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              disabled={page === 1 || loading}
              onClick={() => fetchBooks(page - 1)}
            >
              Prev
            </Button>

            <Typography sx={{ color: "#ffa500", fontWeight: 600 }}>
              Page {page}
            </Typography>

            <Button
              disabled={loading || books.length < 100}
              onClick={() => fetchBooks(page + 1)}
            >
              Next
            </Button>
          </Box>
        )}

        {/* ================= MODAL ================= */}
        <BookDetailModal
          open={modalOpen}
          book={selectedBook}
          onClose={() => setModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      </Box>
    </Box>
  );
};

export default BooksPage;
