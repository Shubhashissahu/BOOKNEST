//src/pages/home.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Grid, Typography, Button, Skeleton, Alert } from "@mui/material";

import HeroSection from "../Components/HeroSection";
import CategorySection from "../Components/CategorySection";
import BookCard from "../Components/BookCard";
import BookDetailModal from "../Components/BookDetailModal";

import {
  fetchTrending,
  fetchBySubject,
  CATEGORY_SUBJECTS,
  getReadUrl,
} from "../Services/openLibrary";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const CATEGORIES = [
  { name: "All Books", value: "all", icon: "📚" },
  { name: "Fiction", value: "fiction", icon: "📖" },
  { name: "Science", value: "science", icon: "🔬" },
  { name: "Self-Help", value: "self-help", icon: "🌱" },
  { name: "Business", value: "business", icon: "💼" },
  { name: "History", value: "history", icon: "🏛️" },
];

// ─────────────────────────────────────────────
// SKELETON
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
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Home({ addToCart }) {

  // ── Refs
  const categoryRef = useRef(null);
  const cacheRef = useRef({});

  // ── State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ─────────────────────────────────────────────
  // FETCH LOGIC
  // ─────────────────────────────────────────────
  const fetchBooks = useCallback(async (category) => {

    // Cache hit
    if (cacheRef.current[category]) {
      setBooks(cacheRef.current[category]);
      return;
    }

    if (books.length === 0) setLoading(true);
    setError(null);

    try {
      let result = [];

      if (category === "all") {
        result = await fetchTrending("weekly", 12);
      } else {
        const subject = CATEGORY_SUBJECTS[category];
        if (subject) result = await fetchBySubject(subject, 12);
      }

      cacheRef.current[category] = result;
      setBooks(result);

    } catch (err) {
      setError("Failed to load books.",err);
      setBooks([]);
    } finally {
      setLoading(false);
    }

  }, [books.length]);

  // Initial + category change
  useEffect(() => {
    fetchBooks(selectedCategory);
  }, [selectedCategory, fetchBooks]);

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);

    setTimeout(() => {
      categoryRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleViewDetails = async (book) => {
    setSelectedBook(book);
    setModalOpen(true);

    try {
      const readUrl = await getReadUrl(book.title, book.author);

      setSelectedBook((prev) => ({
        ...prev,
        readUrl,
      }));
    } catch {
      // silent fail
    }
  };

  // ─────────────────────────────────────────────
  // RENDER HELPERS
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
              <Button onClick={() => fetchBooks(selectedCategory)}>
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
          <Typography align="center">No books found</Typography>
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

  const currentCategory = CATEGORIES.find(
    (c) => c.value === selectedCategory
  );

  // ─────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────
  return (
    <Box sx={{ color: "white" }}>

      {/* HERO */}
      <HeroSection
        onBrowse={() =>
          categoryRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* CATEGORY */}
      <CategorySection
        categoryRef={categoryRef}
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelect={handleCategoryChange}
        onClear={() => handleCategoryChange("all")}
      />

      {/* BOOK GRID */}
      <Box sx={{ maxWidth: 1280, mx: "auto", px: 2, pb: 8 }}>

        <Typography sx={{ mb: 3, fontWeight: 700 }}>
          {selectedCategory === "all"
            ? "🔥 Trending"
            : `📚 ${currentCategory?.name}`}
        </Typography>

        <Grid container spacing={3}>
          {renderContent()}
        </Grid>

        {!loading && !error && books.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button variant="contained" href="/books">
              View All
            </Button>
          </Box>
        )}
      </Box>

      {/* MODAL */}
      <BookDetailModal
        open={modalOpen}
        book={selectedBook}
        onClose={() => setModalOpen(false)}
        onAddToCart={addToCart}
      />
    </Box>
  );
}