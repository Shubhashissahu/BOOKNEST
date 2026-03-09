import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import {
  Facebook,
  Instagram,
  Twitter,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        background: "#0f0f0f",
        color: "#bbb",
        pt: 6,
        pb: 3,
        px: { xs: 3, md: 10 },
        borderTop: "1px solid #222",
      }}
    >
      {/* TOP FOOTER */}
      <Grid container spacing={6}>

        {/* BRAND */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: "#ffa500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#000",
              }}
            >
              📖
            </Box>

            <Typography sx={{ fontSize: 18, color: "#fff" }}>
              BookNest
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 2,
              fontSize: 14,
              lineHeight: 1.6,
              color: "#888",
            }}
          >
            BookNest is your trusted destination for discovering amazing reads
            across all genres.
          </Typography>

          {/* SOCIAL */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <IconButton sx={iconStyle}><Facebook /></IconButton>
            <IconButton sx={iconStyle}><Twitter /></IconButton>
            <IconButton sx={iconStyle}><Instagram /></IconButton>
          </Box>
        </Grid>

        {/* QUICK LINKS */}
        <Grid item xs={6} md={3}>
          <Typography sx={title}>Quick Links</Typography>

          {["Best Sellers", "New Arrivals", "Coming Soon", "Gift Cards"].map(
            (item) => (
              <Typography key={item} sx={link}>
                {item}
              </Typography>
            )
          )}
        </Grid>

        {/* CUSTOMER SERVICE */}
        <Grid item xs={6} md={3}>
          <Typography sx={title}>Customer Service</Typography>

          {["Contact Us", "Shipping Info", "Returns & Refunds", "FAQ"].map(
            (item) => (
              <Typography key={item} sx={link}>
                {item}
              </Typography>
            )
          )}
        </Grid>

        {/* NEWSLETTER */}
        <Grid item xs={12} md={3}>
          <Typography sx={title}>Newsletter</Typography>

          <Typography sx={{ fontSize: 14, color: "#888", mb: 2 }}>
            Subscribe to get special offers and updates on new arrivals.
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              placeholder="Your email"
              size="small"
              sx={{
                flex: 1,
                background: "#111",
                borderRadius: 1,
                input: { color: "#fff" },
              }}
            />

            <Button
              sx={{
                background: "#ff8c00",
                color: "#fff",
                px: 2.5,
                "&:hover": { background: "#ff9800" },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* DIVIDER */}
      <Box
        sx={{
          height: 1,
          background: "#222",
          my: 4,
        }}
      />

      {/* BOTTOM FOOTER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
          color: "#777",
        }}
      >
        <Typography>© 2026 BookNest. All rights reserved.</Typography>

        <Box sx={{ display: "flex", gap: 3, mt: { xs: 2, md: 0 } }}>
          <Typography sx={policy}>Terms of Service</Typography>
          <Typography sx={policy}>Privacy Policy</Typography>
          <Typography sx={policy}>Cookie Policy</Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* STYLES */

const title = {
  color: "#ffa500",
  fontWeight: "bold",
  mb: 2,
  fontSize: 16,
};

const link = {
  color: "#888",
  mb: 1,
  fontSize: 14,
  cursor: "pointer",
  "&:hover": { color: "#ffa500" },
};

const iconStyle = {
  background: "#1c1c1c",
  color: "#fff",
  "&:hover": {
    background: "#ffa500",
    color: "#000",
  },
};

const policy = {
  cursor: "pointer",
  "&:hover": { color: "#ffa500" },
};