import { Box, Typography, Button, Grid } from "@mui/material";

export default function HeroSection({ onBrowse }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        left: "50%",
        right: "50%",
        transform: "translateX(-50%)", // Simplified centering
        minHeight: "100vh",
        mt: "-64px",
        pt: "64px",
        background: "radial-gradient(circle at top left, #222 0%, #0d0d0d 60%)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden", // Prevent horizontal scroll
      }}
    >
      {/* Aligned container with navbar */}
      <Box 
        sx={{ 
          width: "100%", 
          maxWidth: "1200px", // Optional: limit max width
          mx: "auto", // Center the content
          px: { xs: 2, sm: 3, md: 4 } // Responsive padding
        }}
      >
        <Grid 
          container 
          spacing={{ xs: 4, md: 6 }} 
          alignItems="center"
          sx={{ flexDirection: { xs: "column-reverse", md: "row" } }} // Stack on mobile
        >
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1" // Changed to h1 for better SEO
              sx={{
                fontWeight: 800,
                mb: 3,
                color: "#ffa500",
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" }, // Responsive font size
                lineHeight: 1.2,
              }}
            >
              Discover Your Next
              <br />
              Great Read
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.75)",
                mb: 4,
                maxWidth: 520,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
              }}
            >
              Explore thousands of books across genres. Find stories that
              inspire, educate, and entertain—curated just for you.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={onBrowse}
                sx={{
                  px: { xs: 3, md: 4 },
                  py: 1.3,
                  borderRadius: "999px",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #ffa500, #ff5e00)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #ff5e00, #ffa500)",
                  },
                }}
              >
                Browse Collection
              </Button>

              <Button
                variant="outlined"
                sx={{
                  px: { xs: 3, md: 4 },
                  py: 1.3,
                  borderRadius: "999px",
                  borderColor: "#ffa500",
                  color: "#ffa500",
                  "&:hover": {
                    borderColor: "#ff5e00",
                    backgroundColor: "rgba(255, 165, 0, 0.1)",
                  },
                }}
              >
                View Best Sellers
              </Button>
            </Box>
          </Grid>

          {/* RIGHT COLUMN - IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1628977613138-dcfede720de7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Bookstore with bookshelves"
              sx={{
                width: "100%",
                maxWidth: 500,
                height: { xs: 300, sm: 400, md: 450 }, // Responsive height
                objectFit: "cover",
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}