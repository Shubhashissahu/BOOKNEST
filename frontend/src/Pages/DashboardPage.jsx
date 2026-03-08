import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Avatar,
  Button,
  Divider,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { AuthContext } from "../context/AuthContext";

/* Mock Data */

const stats = [
  { label: "Books Purchased", value: 47, color: "#ff7a00", icon: "📚" },
  { label: "Active Orders", value: 3, color: "#4c6fff", icon: "📦" },
  { label: "Wishlist", value: 12, color: "#ff2d7a", icon: "❤️" },
  { label: "Reading Streak", value: "28d", color: "#00d4aa", icon: "🔥" },
];

const orders = [
  { id: "BN-20248", date: "Feb 28, 2026", items: 3, price: "54.97" },
  { id: "BN-20197", date: "Feb 14, 2026", items: 1, price: "16.99" },
  { id: "BN-20156", date: "Jan 30, 2026", items: 2, price: "33.98" },
  { id: "BN-20089", date: "Jan 10, 2026", items: 4, price: "71.96" },
];

const reading = [
  { title: "The Midnight Library", author: "Matt Haig", progress: 78 },
  { title: "Atomic Habits", author: "James Clear", progress: 45 },
  { title: "Sapiens", author: "Yuval Noah Harari", progress: 12 },
];
/* Helpers */

const getInitials = (n) =>
  n ? n.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase() : "Y";

const memberSince = () =>
  new Date().toLocaleString("default", { month: "long", year: "numeric" });

const card = {
  p: 3,
  borderRadius: 3,
  bgcolor: "#0d0d0d",
  border: "1px solid #222",
  height: "100%",
};

/* Components */

const SectionHeader = ({ icon, title, link }) => (
  <>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="h6" color="white" fontWeight={700}>
          {title}
        </Typography>
      </Box>

      {link && (
        <Button
          component={Link}
          to={link}
          size="small"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{ color: "#ffa500", textTransform: "none", fontWeight: 600 }}
        >
          View All
        </Button>
      )}
    </Box>

    <Divider sx={{ borderColor: "#1f1f1f", mb: 2 }} />
  </>
);

const ListRow = ({ left, right }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1.7,
      borderBottom: "1px solid #1a1a1a",
      "&:last-child": { borderBottom: "none" },
    }}
  >
    {left}
    {right}
  </Box>
);

const ProgressItem = ({ label, value, color }) => (
  <Box mb={2.5}>
    <Box display="flex" justifyContent="space-between" mb={0.8}>
      <Typography fontSize={13} sx={{ color: "rgba(255,255,255,0.55)" }}>
        {label}
      </Typography>

      <Typography fontSize={13} fontWeight={700} sx={{ color }}>
        {value}%
      </Typography>
    </Box>

    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 6,
        borderRadius: 10,
        bgcolor: "#2a2a2a",
        "& .MuiLinearProgress-bar": {
          bgcolor: color,
          borderRadius: 10,
        },
      }}
    />
  </Box>
);

/* Dashboard */
export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 6,
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,166,0,0.06), transparent 40%)," +
          "radial-gradient(circle at 80% 0%, rgba(79,195,247,0.06), transparent 40%)," +
          "linear-gradient(135deg,#0b0b0b 0%,#141414 40%,#1a1a2e 100%)",
      }}
    >

      {/* FULL WIDTH BANNER */}
      <Paper
        sx={{
          width: "100%",
          borderRadius: 0,
          mb: 4,
          p: 4,
          background:
            "linear-gradient(120deg,#ff7a00 0%,#ff5e00 55%,#cc3d00 100%)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2.5}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.3)",
              fontWeight: 800,
              color: "white",
            }}
          >
            {getInitials(user?.name)}
          </Avatar>

          <Box>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
              Welcome back 👋
            </Typography>

            <Typography variant="h5" fontWeight={700} color="white">
              {user?.name ? `${user.name}'s Dashboard` : "Your Dashboard"}
            </Typography>

            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
              {user?.email || "you@gmail.com"} · Member since {memberSince()}
            </Typography>
          </Box>
        </Box>

        <Button
          component={Link}
          to="/profile"
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "rgba(255,255,255,0.55)",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Edit Profile
        </Button>
      </Paper>

      {/* DASHBOARD CONTENT CONTAINER */}
      <Box
        sx={{
          maxWidth: "1300px",
          mx: "auto",
          px: 3,
        }}
      >

        {/* Stats */}
        <Grid container spacing={3} mb={4}>
          {stats.map((s) => (
            <Grid item xs={6} md={3} key={s.label}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background: `linear-gradient(135deg,${s.color}28,#0b0b0b)`,
                  border: `1px solid ${s.color}40`,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: s.color,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  {s.icon}
                </Box>

                <Box>
                  <Typography variant="h5" color="white" fontWeight={700}>
                    {s.value}
                  </Typography>

                  <Typography fontSize={13} color="rgba(255,255,255,0.5)">
                    {s.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Orders + Reading */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={card}>
              <SectionHeader
                icon={<ShoppingBagIcon sx={{ color: "#ffa500" }} />}
                title="Recent Orders"
                link="/orders"
              />

              {orders.map((o) => (
                <ListRow
                  key={o.id}
                  left={
                    <Box>
                      <Typography color="white" fontWeight={600}>
                        #{o.id}
                      </Typography>

                      <Typography fontSize={13} color="rgba(255,255,255,0.4)">
                        {o.date} · {o.items} items
                      </Typography>
                    </Box>
                  }
                  right={
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Typography color="white" fontWeight={600}>
                        ${o.price}
                      </Typography>

                      <Box
                        sx={{
                          px: 1.4,
                          py: 0.35,
                          borderRadius: 10,
                          fontSize: 12,
                          bgcolor: "#043d2c",
                          color: "#00ffa6",
                        }}
                      >
                        Delivered
                      </Box>
                    </Box>
                  }
                />
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={card}>
              <SectionHeader
                icon={<MenuBookIcon sx={{ color: "#ffa500" }} />}
                title="Currently Reading"
              />

              {reading.map((b) => (
                <ProgressItem
                  key={b.title}
                  label={`${b.title} — ${b.author}`}
                  value={b.progress}
                  color="#ffa500"
                />
              ))}
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
}