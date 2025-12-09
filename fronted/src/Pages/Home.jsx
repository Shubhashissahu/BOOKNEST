// src/Pages/HomePage.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import ScienceIcon from "@mui/icons-material/Science";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: "#0d0d0d", color: "common.white", minHeight: "100vh" }}>
      {/* HERO */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(180deg, #0d0d0d 0%, #151515 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{ color: "orange", fontWeight: 600, mb: 1 }}
              >
                ✨ 10,000+ Books Available
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.05,
                  background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Discover Your Next Great Read
              </Typography>

              <Typography sx={{ mt: 3, color: "rgba(255,255,255,0.75)", fontSize: 18 }}>
                Explore thousands of books across every genre — a perfect mix of classics,
                new releases, and hidden gems curated for you.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 4, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "orange",
                    color: "#000",
                    px: 4,
                    fontWeight: 700,
                    borderRadius: "999px",
                    "&:hover": { bgcolor: "#ff9900" },
                  }}
                >
                  Browse Books
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "rgba(255,255,255,0.18)",
                    color: "white",
                    px: 4,
                    fontWeight: 700,
                    borderRadius: "999px",
                    "&:hover": { borderColor: "orange", color: "orange" },
                  }}
                >
                  Best Sellers
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1535905557558-afc4877a26fc"
                  alt="Bookshelf"
                  style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: "center", mb: 6, fontWeight: 800 }}>
            Why Choose BookNest?
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <LocalLibraryIcon sx={{ fontSize: 52, color: "orange" }} />,
                title: "Huge Collection",
                desc: "Thousands of books across genres and categories.",
              },
              {
                icon: <ScienceIcon sx={{ fontSize: 52, color: "#4caf50" }} />,
                title: "Knowledge Hub",
                desc: "Science, research and advanced learning made easy.",
              },
              {
                icon: <HistoryEduIcon sx={{ fontSize: 52, color: "#ff9800" }} />,
                title: "Historical Archives",
                desc: "Dive into history and timeless literature.",
              },
              {
                icon: <PsychologyIcon sx={{ fontSize: 52, color: "#f44336" }} />,
                title: "Self Growth",
                desc: "Curated books to improve life and mindset.",
              },
            ].map((card, i) => (
              <Grid item xs={12} md={3} key={i}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: "#111",
                    color: "white",
                    textAlign: "center",
                    py: 4,
                    borderRadius: 3,
                    transition: "transform .25s, box-shadow .25s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(255,165,0,0.12)",
                    },
                  }}
                >
                  <CardContent>
                    {card.icon}
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ opacity: 0.75, mt: 1 }}>{card.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CATEGORIES */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "#070707" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: "center", mb: 6, fontWeight: 800 }}>
            Popular Categories
          </Typography>

          <Grid container spacing={4}>
            {[
              { title: "Fiction", icon: <LocalLibraryIcon /> },
              { title: "Science", icon: <ScienceIcon /> },
              { title: "History", icon: <HistoryEduIcon /> },
              { title: "Self Help", icon: <PsychologyIcon /> },
              { title: "Business", icon: <BusinessCenterIcon /> },
              { title: "More", icon: <MoreHorizIcon /> },
            ].map((cat, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card
                  sx={{
                    bgcolor: "#111",
                    color: "white",
                    textAlign: "center",
                    py: 6,
                    borderRadius: 3,
                    transition: "transform .2s",
                    "&:hover": { transform: "scale(1.03)", boxShadow: "0 12px 40px rgba(255,165,0,0.12)" },
                  }}
                >
                  <CardContent>
                    <Box sx={{ fontSize: 56, color: "orange", mb: 1 }}>{cat.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {cat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* STATS */}
      <Box component="section" sx={{ py: 8, background: "linear-gradient(180deg,#1e3a8a,#1e40af)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" textAlign="center">
            {[
              { num: "50K+", label: "Books Available" },
              { num: "100K+", label: "Happy Readers" },
              { num: "24/7", label: "Support" },
              { num: "100%", label: "Secure Payments" },
            ].map((s, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>{s.num}</Typography>
                <Typography sx={{ opacity: 0.85 }}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
