import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  CardMedia,
  CardContent,
} from "@mui/material";

import { books } from "../data/booksData";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categoryRef = useRef(null);

  // CATEGORY LIST (CLEAN + EMOJIS WORK PERFECTLY)
  const categories = [
    { name: "All Books", value: "all", icon: "📚" },
    { name: "Fiction", value: "fiction", icon: "📖" },
    { name: "Science", value: "science", icon: "🔬" },
    { name: "Self-Help", value: "self-help", icon: "🌱" },
    { name: "Business", value: "business", icon: "💼" },
    { name: "History", value: "history", icon: "🏛️" },
  ];

  // FILTER LOGIC (FIXED)
  const filteredBooks =
    selectedCategory === "all"
      ? books
      : books.filter((b) => b.category.toLowerCase() === selectedCategory);

  // SCROLL TO CATEGORY SECTION
  const goToCategories = () => {
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  window.goToCategories = goToCategories;

  return (
    <Box sx={{ color: "white", px: 2, py: 4 }}>

      {/* ⭐ HERO SECTION */}
      <Box
        sx={{
          py: 10,
          px: 2,
          borderRadius: 3,
          mt: 3,
          background: "linear-gradient(135deg,#111,#1a1a1a)",
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          maxWidth="lg"
          sx={{ mx: "auto" }}
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 2,
                background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Discover Your Next Great Read
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
            >
              Explore thousands of books across genres.
              Find stories that inspire, teach, and entertain.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: "30px",
                  background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                  fontWeight: "bold",
                }}
                onClick={goToCategories}
              >
                Browse Collection
              </Button>

              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: "30px",
                  borderColor: "#ffa500",
                  color: "#ffa500",
                  fontWeight: "bold",
                }}
              >
                View Best Sellers
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1628977613138-dcfede720de7"
              alt="Bookstore"
              sx={{
                width: "100%",
                maxWidth: 500,
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ⭐ CATEGORY SECTION */}
      <Box ref={categoryRef} sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: "#ffa500",
          }}
        >
          Browse Our Collection
        </Typography>

        <Typography sx={{ opacity: 0.7, mb: 4 }}>
          Explore books across different categories.
        </Typography>

        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={cat.value}>
              <Card
                onClick={() => setSelectedCategory(cat.value)}
                sx={{
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: 4,
                  transition: "0.3s",
                  background:
                    selectedCategory === cat.value
                      ? "linear-gradient(135deg,#ffa50033,#ff5e0033)"
                      : "rgba(255,255,255,0.06)",
                  border:
                    selectedCategory === cat.value
                      ? "2px solid #ffa500"
                      : "1px solid rgba(255,255,255,0.1)",
                  "&:hover": {
                    borderColor: "#ffa500",
                    background: "rgba(255,165,0,0.1)",
                  },
                }}
              >
                <Box sx={{ fontSize: 50, mb: 1 }}>{cat.icon}</Box>
                <Typography sx={{ fontWeight: "bold" }}>{cat.name}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ⭐ Filter label */}
        {selectedCategory !== "all" && (
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: "#ffa500" }}>
              Filtered by: {categories.find((c) => c.value === selectedCategory)?.name}
            </Typography>

            <Button
              onClick={() => setSelectedCategory("all")}
              sx={{ color: "#ffa500", mt: 1 }}
            >
              Clear filter
            </Button>
          </Box>
        )}
      </Box>

      {/* ⭐ BOOK GRID */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card
                sx={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardMedia component="img" height="240" image={book.cover} />

                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {book.title}
                  </Typography>

                  <Typography sx={{ opacity: 0.6 }}>
                    by {book.author}
                  </Typography>

                  <Typography sx={{ mt: 1, color: "#00e676" }}>
                    ₹{book.price}
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                      borderRadius: "30px",
                    }}
                    onClick={() => alert("Open book modal here")}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
