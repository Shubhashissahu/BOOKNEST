import { Box, Grid } from "@mui/material";
import { useState, useRef } from "react";

import HeroSection from "../Components/HeroSection";
import CategorySection from "../Components/CategorySection";
import BookCard from "../Components/BookCard";

import { books } from "../data/booksData";

export default function Home() {
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

  const filteredBooks =
    selectedCategory === "all"
      ? books
      : books.filter(
          (b) => b.category.toLowerCase() === selectedCategory
        );

  // handlers (can be replaced with real logic later)
  const handleViewDetails = (book) => {
    console.log("View details:", book);
  };

  const handleAddToCart = (book) => {
    console.log("Add to cart:", book);
  };

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
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        onClear={() => setSelectedCategory("all")}
      />

      {/* BOOK GRID */}
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2, md: 4 },
          mt: 6,
        }}
      >
        <Grid container spacing={4}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <BookCard
                book={book}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
