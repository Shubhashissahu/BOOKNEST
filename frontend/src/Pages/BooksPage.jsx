import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Skeleton,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import BookCard from "../Components/BookCard";
import BookDetailModal from "../Components/BookDetailModal";

import {
  searchBooks,
  fetchTrending,
  getReadUrl,
} from "../Services/openLibrary";

// ─────────────────────────────────────────────
const BookSkeleton = () => (
  <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
    <Skeleton variant="rectangular" height={280} />
    <Box sx={{ p: 1 }}>
      <Skeleton width="80%" />
      <Skeleton width="60%" />
    </Box>
  </Box>
);

// ─────────────────────────────────────────────
export default function BooksPage({ addToCart }) {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalFound, setTotalFound] = useState(0);

  const [isSearchMode, setIsSearchMode] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ─────────────────────────────────────────────
  // TRENDING
  // ─────────────────────────────────────────────
  const loadTrending = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsSearchMode(false);

    try {
      const data = await fetchTrending("weekly", 12);
      setBooks(data);

      // Optional success (subtle)
      // toast.info("Showing trending books 🔥");

    } catch (err) {
      console.error(err);
      setError("Failed to load trending books.");
      toast.error("Failed to load trending books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────
  const fetchBooks = useCallback(async (searchQuery, newPage = 1) => {
    if (!searchQuery.trim()) {
      toast.warn("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearchMode(true);

    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const result = await searchBooks(searchQuery, newPage, 12);

      setBooks(result.docs);
      setPage(result.page);
      setTotalFound(result.totalFound);

      if (newPage === 1) {
        toast.success(`Results for "${searchQuery}"`);
      }

    } catch (err) {
      console.error(err);
      setError("Search failed. Try again.");
      toast.error("Search failed");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────
  useEffect(() => {
    const q = searchParams.get("q");

    if (q) {
      setQuery(q);
      fetchBooks(q, 1);
    } else {
      loadTrending();
    }
  }, [searchParams, fetchBooks, loadTrending]);

  // ─────────────────────────────────────────────
  // VIEW DETAILS
  // ─────────────────────────────────────────────
  const handleViewDetails = async (book) => {
    setSelectedBook(book);
    setModalOpen(true);

    try {
      const readUrl = await getReadUrl(book.title || "", book.author || "");

      setSelectedBook((prev) => ({
        ...prev,
        readUrl,
      }));

    } catch (err) {
      console.error(err);
      toast.error("Failed to load book preview");
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 12 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <BookSkeleton />
        </Grid>
      ));
    }

    if (error) {
      return (
        <Grid item xs={12}>
          <Alert
            severity="error"
            action={
              <Button
                startIcon={<RefreshIcon />}
                onClick={() =>
                  isSearchMode
                    ? fetchBooks(query, page)
                    : loadTrending()
                }
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Grid>
      );
    }

    if (books.length === 0) {
      return (
        <Grid item xs={12}>
          <Typography align="center">
            No books found.
          </Typography>
        </Grid>
      );
    }

    return books.map((book) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
        <BookCard
          book={book}
          onAddToCart={() => addToCart(book)}
          onViewDetails={() => handleViewDetails(book)}
        />
      </Grid>
    ));
  };

  // ─────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", px: 2, py: 3 }}>
      <Box sx={{ maxWidth: 1300, mx: "auto" }}>

        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          {isSearchMode ? "Search Results" : "🔥 Trending Books"}
        </Typography>

        {isSearchMode && !loading && totalFound > 0 && (
          <Typography sx={{ textAlign: "center", mb: 2, opacity: 0.6 }}>
            {totalFound.toLocaleString()} results for "{query}"
          </Typography>
        )}

        {/* SEARCH */}
  <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    gap: 1.5,
    mb: 3,
    flexWrap: "wrap",
  }}
>
  {/* SEARCH INPUT */}
  <TextField
    size="small"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") fetchBooks(query, 1);
    }}
    placeholder="Search books, authors, topics..."
    InputProps={{
      startAdornment: (
        <SearchIcon sx={{ color: "#ffa500", mr: 1 }} />
      ),
      sx: {
        color: "white",
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.1)",
        transition: "0.2s",

        "& input": {
          color: "white",
        },

        "&:hover": {
          border: "1px solid rgba(255,165,0,0.4)",
        },

        "&.Mui-focused": {
          border: "1px solid #ffa500",
          boxShadow: "0 0 0 2px rgba(255,165,0,0.2)",
        },
      },
    }}
  />

  {/* SEARCH BUTTON */}
  <Button
    variant="contained"
    onClick={() => fetchBooks(query, 1)}
    disabled={loading}
    sx={{
      px: 3,
      borderRadius: 2,
      fontWeight: 600,
      textTransform: "none",
      background: "linear-gradient(135deg, #ff9800, #ffb300)",

      "&:hover": {
        background: "linear-gradient(135deg, #ffa726, #ffc107)",
      },
    }}
  >
    {loading ? (
      <CircularProgress size={18} sx={{ color: "black" }} />
    ) : (
      "Search"
    )}
  </Button>
</Box>

        <Grid container spacing={3}>
          {renderContent()}
        </Grid>

        {/* PAGINATION */}
        {isSearchMode && !loading && books.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              disabled={page === 1}
              onClick={() => fetchBooks(query, page - 1)}
            >
              Prev
            </Button>

            <Typography sx={{ display: "inline", mx: 2 }}>
              Page {page}
            </Typography>

            <Button onClick={() => fetchBooks(query, page + 1)}>
              Next
            </Button>
          </Box>
        )}
      </Box>

      <BookDetailModal
        open={modalOpen}
        book={selectedBook}
        onClose={() => setModalOpen(false)}
        onAddToCart={addToCart}
      />
    </Box>
  );
}