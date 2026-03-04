import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton } from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        background: "#0f0f0f",
        color: "#ccc",
        pt: 8,
        pb: 4,
        px: { xs: 3, md: 10 },
        mt: 8,
      }}
    >
      {/* MAIN FOOTER GRID */}
      <Grid container spacing={6}>
        
        {/* BRAND SECTION */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "#ffa500",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              📘
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#ffa500",
              }}
            >
              BookNest
            </Typography>
          </Box>

          <Typography sx={{ mt: 2, color: "gray", lineHeight: 1.6 }}>
            BookNest is your trusted destination for discovering amazing reads across all
            genres. Quality books delivered with care.
          </Typography>

          {/* SOCIAL ICONS */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <IconButton sx={iconStyle}><Facebook /></IconButton>
            <IconButton sx={iconStyle}><Twitter /></IconButton>
            <IconButton sx={iconStyle}><Instagram /></IconButton>
            <IconButton sx={iconStyle}><LinkedIn /></IconButton>
          </Box>
        </Grid>

        {/* QUICK LINKS */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={sectionTitle}>Quick Links</Typography>

          {["Best Sellers", "New Arrivals", "Coming Soon", "Gift Cards"].map((item) => (
            <Typography key={item} sx={linkText}>{item}</Typography>
          ))}
        </Grid>

        {/* CUSTOMER SERVICE */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={sectionTitle}>Customer Service</Typography>

          {["Contact Us", "Shipping Info", "Returns & Refunds", "FAQ", "Privacy Policy"]
            .map((item) => (
              <Typography key={item} sx={linkText}>{item}</Typography>
            ))}
        </Grid>
        </Grid>
      {/* DIVIDER */}
      <Box
        sx={{
          height: 1,
          background: "#222",
          my: 4,
        }}
      ></Box>

      {/* COPYRIGHT + POLICIES */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          color: "#777",
          fontSize: "0.9rem",
        }}
      >
        <Typography>© 2025 BookNest. All rights reserved.</Typography>

        <Box sx={{ display: "flex", gap: 3, mt: { xs: 2, md: 0 } }}>
          <Typography sx={policyStyle}>Terms of Service</Typography>
          <Typography sx={policyStyle}>Privacy Policy</Typography>
          <Typography sx={policyStyle}>Cookie Policy</Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* --- STYLES --- */
const iconStyle = {
  background: "#1c1c1c",
  borderRadius: "50%",
  padding: 1,
  color: "#fff",
  "&:hover": { background: "#ffa500", color: "#000" },
};

const sectionTitle = {
  fontWeight: "bold",
  color: "#ffa500",
  mb: 2,
};

const linkText = {
  color: "gray",
  mb: 1,
  cursor: "pointer",
  "&:hover": { color: "#ffa500" },
};

const policyStyle = {
  cursor: "pointer",
  "&:hover": { color: "#ffa500" },
};
