import { Box, Typography, Grid, Paper } from "@mui/material";

export default function CategorySection({
  categoryRef,
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <Box
      ref={categoryRef}
      sx={{
        mt: 6,
        mb: 4,
        maxWidth: "1300px",
        mx: "auto",
        px: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#ffa500",
          mb: 1,
          fontWeight: "bold",
        }}
      >
        Browse Our Collection
      </Typography>

      <Typography sx={{ color: "#aaa", mb: 3 }}>
        Explore books across different categories.
      </Typography>

      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid item xs={6} sm={4} md={2} key={cat.value}>
            <Paper
              onClick={() => onSelect(cat.value)}
              elevation={0}
              sx={{
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                background:
                  selectedCategory === cat.value
                    ? "linear-gradient(90deg,#ffa500,#ff5e00)"
                    : "#111",
                color:
                  selectedCategory === cat.value ? "#000" : "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Typography fontSize={28}>{cat.icon}</Typography>
              <Typography fontWeight="bold" fontSize={14}>
                {cat.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
