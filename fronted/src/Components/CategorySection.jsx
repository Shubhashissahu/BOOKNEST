import { Box, Typography, Grid, Card, Button } from "@mui/material";

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
      sx={{ maxWidth: "1200px", mx: "auto", px: 4, mt: 10 }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", color: "#ffa500" }}
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
              onClick={() => onSelect(cat.value)}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 4,
                background:
                  selectedCategory === cat.value
                    ? "linear-gradient(135deg,#ffa50033,#ff5e0033)"
                    : "rgba(255,255,255,0.06)",
                border:
                  selectedCategory === cat.value
                    ? "2px solid #ffa500"
                    : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Box sx={{ fontSize: 48 }}>{cat.icon}</Box>
              <Typography sx={{ fontWeight: "bold" }}>
                {cat.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedCategory !== "all" && (
        <Button sx={{ mt: 3, color: "#ffa500" }} onClick={onClear}>
          Clear filter
        </Button>
      )}
    </Box>
  );
}
