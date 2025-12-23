import { Box, Typography, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";

/* Motion variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.0, ease: "easeOut" },
  },
};

export default function HeroSection({ onBrowse }) {
  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top left, #222 0%, #0d0d0d 60%)",
      }}
    >
      {/* INNER CONTAINER */}
      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <Grid container spacing={6} alignItems="center">
          {/* LEFT CONTENT */}
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    lineHeight: 1.2,
                    background:
                      "linear-gradient(90deg,#ffa500,#ff5e00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Discover Your Next
                  <br />
                  Great Read
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    mb: 4,
                    maxWidth: 520,
                  }}
                >
                  Explore thousands of books across genres. Find stories
                  that inspire, educate, and entertain—curated just for you.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    onClick={onBrowse}
                    sx={{
                      px: 4,
                      py: 1.3,
                      borderRadius: "999px",
                      fontWeight: "bold",
                      background:
                        "linear-gradient(90deg,#ffa500,#ff5e00)",
                    }}
                  >
                    Browse Collection
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      px: 4,
                      py: 1.3,
                      borderRadius: "999px",
                      borderColor: "#ffa500",
                      color: "#ffa500",
                    }}
                  >
                    View Best Sellers
                  </Button>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <motion.div
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1628977613138-dcfede720de7"
                alt="Bookstore"
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  display: "block",
                  marginLeft: { xs: "auto", md: "auto" },
                  marginRight: { xs: "auto", md: 0 },
                  borderRadius: 4,
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.6)",
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
