
import React from "react";
import { Box, Typography, ButtonBase } from "@mui/material";

const CategorySection = ({
  categoryRef,
  categories = [],
  selectedCategory,
  onSelect,
}) => {
  return (
    <Box
      ref={categoryRef}
      sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        maxWidth: 1280,
        mx: "auto",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#ffa500",
          mb: 0.5,
        }}
      >
        Browse Our Collection
      </Typography>
      <Typography
        sx={{
          color: "rgba(255,255,255,0.45)",
          fontSize: "0.9rem",
          mb: 3,
        }}
      >
        Explore books across different categories
      </Typography>

      {/* Chip row */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1.5, md: 2 },
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;

          return (
            <ButtonBase
              key={cat.value}
              onClick={() => onSelect(cat.value)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                px: { xs: 2, md: 2.5 },
                py: { xs: 1.5, md: 2 },
                borderRadius: 2,
                border: isActive
                  ? "2px solid #ffa500"
                  : "2px solid rgba(255,255,255,0.1)",
                bgcolor: isActive
                  ? "rgba(255,165,0,0.15)"
                  : "rgba(255,255,255,0.03)",
                color: isActive ? "#ffa500" : "rgba(255,255,255,0.6)",
                transition: "all 0.18s ease",
                minWidth: { xs: 70, md: 90 },
                "&:hover": {
                  border: "2px solid rgba(255,165,0,0.5)",
                  bgcolor: "rgba(255,165,0,0.08)",
                  color: "#ffa500",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ fontSize: { xs: "1.4rem", md: "1.6rem" }, lineHeight: 1 }}>
                {cat.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", md: "0.8rem" },
                  fontWeight: isActive ? 700 : 400,
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {cat.name}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default CategorySection;