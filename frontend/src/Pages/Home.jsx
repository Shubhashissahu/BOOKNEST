import React, { useState, useRef } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";

import HeroSection from "../Components/HeroSection";
import CategorySection from "../Components/CategorySection";
import BookCard from "../Components/BookCard";
import ContactPage from "./ContactPage";
import { books } from "../data/booksData";

export default function Home({ cart, setCart }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categoryRef = useRef(null);

  const categories = [
    { name: "All Books", value: "all", icon: "📚" },
    { name: "Fiction", value: "fiction", icon: "📖" },
    { name: "Science", value: "science", icon: "🔬" },
    { name: "Self-Help", value: "self-help", icon: "🌱" },
    { name: "Business", value: "business", icon: "💼" },
    { name: "History", value: "history", icon: "🏛️" },
  ];

  /* ===============================
     TRENDING BOOKS (HOME ONLY)
  =============================== */
  const trendingBooks = books.filter((b) => b.trending);

  /* ===============================
     CATEGORY FILTER
  =============================== */
  const filteredBooks =
    selectedCategory === "all"
      ? trendingBooks
      : trendingBooks.filter(
          (b) => b.category.toLowerCase() === selectedCategory
        );

  /* ===============================
     ADD TO CART (SAME AS BOOKS PAGE)
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
      toast.info("Item quantity updated");
    } else {
      setCart((prev) => [...prev, { ...book, quantity: 1 }]);
      toast.success("Added to cart successfully");
    }
  };

  return (
    <Box sx={{ width: "100%", color: "white" }}>
      {/* ================= HERO ================= */}
      <HeroSection
        onBrowse={() =>
          categoryRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* ================= CATEGORY ================= */}
      <CategorySection
        categoryRef={categoryRef}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        onClear={() => setSelectedCategory("all")}
      />

      {/* ================= TRENDING BOOKS ================= */}
    <Box sx={{ width: "100%", mt: 4 }}>

        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, md: 4 },
            pb: 6,
          }}
        >
          <Typography
  sx={{
    mb: 2,           // ⬅ tighter
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffa500",
  }}
>
  🔥 Trending Books
</Typography>


       <Grid container spacing={3} justifyContent="center">

            {filteredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <BookCard
                  book={book}
                  onAddToCart={() => handleAddToCart(book)}
                  onViewDetails={() => console.log("View details", book)}
                />
              </Grid>
            ))}
          </Grid>

          {/* VIEW ALL */}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              color="warning"
              size="large"
              href="/books"
            >
              View All Books
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ================= CONTACT ================= */}
      <ContactPage />
    </Box>
  );
}
