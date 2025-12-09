import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";

export default function HeroSection() {
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
