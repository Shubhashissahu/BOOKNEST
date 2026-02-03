import { Box, Typography, Card, Button, Grid } from "@mui/material";

export default function CategorySection({
  categories,
  selectedCategory,
  onSelect,
  onClear,
  categoryRef,
}) {
  return (
    <Box
      ref={categoryRef}
      sx={{
        width: "100%",
        px: { xs: 2, md: 3 },
        mt: 12,
      }}
    >
      <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: 800,
          color: "#ffa500",
          mb: 2,
        }}
      >
        Browse Our Collection
      </Typography>

      <Typography sx={{ opacity: 0.75, mb: 4 }}>
        Explore books across different categories.
      </Typography>

      <Grid container spacing={3}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={cat.value}>
            <Card
              className="category-card"
              onClick={() => onSelect(cat.value)}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 4,
                background:
                  selectedCategory === cat.value
                    ? "linear-gradient(135deg,#ffa50033,#ff5e0033)"
                    : "rgba(255,255,255,0.06)",
                border:
                  selectedCategory === cat.value
                    ? "2px solid #ffa500"
                    : "1px solid rgba(255,255,255,0.12)",
                color: "white",
              }}
            >
              <Box sx={{ fontSize: 42, mb: 1 }}>
                {cat.icon}
              </Box>
              <Typography sx={{ fontWeight: 600 }}>
                {cat.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedCategory !== "all" && (
        <Button
          sx={{ mt: 4, color: "#ffa500" }}
          onClick={onClear}
        >
          Clear filter
        </Button>
      )}
    </Box>
  );
}
