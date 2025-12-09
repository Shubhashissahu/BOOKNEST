import React from "react";
import { Box, Typography, Grid, Card, Button } from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CategoryIcon from "@mui/icons-material/Category";

// ⭐ Hero Section Component
function HeroSection() {
  return (
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
        {/* LEFT SIDE */}
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
            Explore thousands of books across all genres.  
            Find stories that inspire, teach, and entertain—anytime, anywhere.
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
                "&:hover": { opacity: 0.9 },
              }}
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
                "&:hover": { borderColor: "#ff5e00", color: "#ff5e00" },
              }}
            >
              View Best Sellers
            </Button>
          </Box>
        </Grid>

        {/* RIGHT SIDE IMAGE */}
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
  );
}

// ⭐ Main Home Page
export default function HomePage() {
  return (
    <Box sx={{ color: "white", minHeight: "100vh" }}>

      {/* Hero Section */}
      <HeroSection />

      {/* ⭐ Stats Section */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4} justifyContent="center" maxWidth="lg" sx={{ mx: "auto" }}>
          
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.06)",
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <LibraryBooksIcon sx={{ fontSize: 50, color: "#ffa500" }} />
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                10,000+
              </Typography>
              <Typography sx={{ opacity: 0.6 }}>Books Available</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.06)",
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <PeopleAltIcon sx={{ fontSize: 50, color: "#ffa500" }} />
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                500+
              </Typography>
              <Typography sx={{ opacity: 0.6 }}>Authors</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.06)",
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <CategoryIcon sx={{ fontSize: 50, color: "#ffa500" }} />
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                50+
              </Typography>
              <Typography sx={{ opacity: 0.6 }}>Categories</Typography>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* 🎁 CTA SECTION */}
      <Box sx={{ textAlign: "center", mt: 8, mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Start Your Reading Journey Today!
        </Typography>
        <Typography sx={{ opacity: 0.6, mb: 3 }}>
          Join thousands of readers who enjoy BOOKNEST every day.
        </Typography>

        <Button
          variant="contained"
          sx={{
            px: 6,
            py: 1.7,
            fontSize: "1.1rem",
            borderRadius: "30px",
            background: "linear-gradient(90deg,#ffa500,#ff5e00)",
            fontWeight: "bold",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          Explore All Books
        </Button>
      </Box>
    </Box>
  );
}
