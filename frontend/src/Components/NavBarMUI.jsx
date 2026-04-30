import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge,
  Menu, MenuItem, Avatar, Divider, ListItemIcon, ListItemText,
  Button, Tooltip, Popover, LinearProgress
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";

import SearchIcon        from "@mui/icons-material/Search";
import ShoppingCartIcon  from "@mui/icons-material/ShoppingCart";
import DarkModeIcon      from "@mui/icons-material/DarkMode";
import MenuIcon          from "@mui/icons-material/Menu";
import MenuBookIcon      from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagIcon   from "@mui/icons-material/ShoppingBag";
import DashboardIcon     from "@mui/icons-material/Dashboard";
import FavoriteIcon      from "@mui/icons-material/Favorite";
import SettingsIcon      from "@mui/icons-material/Settings";
import LogoutIcon        from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CardGiftcardIcon  from "@mui/icons-material/CardGiftcard";
import AutoStoriesIcon   from "@mui/icons-material/AutoStories";
import NewReleasesIcon   from "@mui/icons-material/NewReleases";
import LocalOfferIcon    from "@mui/icons-material/LocalOffer";

import { AuthContext } from "../context/AuthContext";

/* ─────────────────────────────────────────────
   ✅ FIX #9 — Static data OUTSIDE component
   so it's not recreated on every render
───────────────────────────────────────────── */
const navLinks = [
  { label: "Home",        path: "/" },
  { label: "Books",       path: "/books" },
  { label: "Best Sellers",path: "/best-sellers" },
  { label: "New Arrivals",path: "/new-arrivals" },
  { label: "Contact",     path: "/contact" },
];

const profileMenu = [
  { label: "My Profile", path: "/profile",   icon: <AccountCircleIcon sx={{ color: "#ffa500", fontSize: 20 }} /> },
  { label: "My Orders",  path: "/orders",    icon: <ShoppingBagIcon   sx={{ color: "#ffa500", fontSize: 20 }} /> },
  { label: "Dashboard",  path: "/dashboard", icon: <DashboardIcon     sx={{ color: "#ffa500", fontSize: 20 }} /> },
  { label: "Wishlist",   path: "/wishlist",  icon: <FavoriteIcon      sx={{ color: "#ffa500", fontSize: 20 }} /> },
  { label: "Settings",   path: "/settings",  icon: <SettingsIcon      sx={{ color: "#ffa500", fontSize: 20 }} /> },
];

// ✅ FIX #3 — Icon components stored by type key, NOT JSX in state
const NOTIF_ICONS = {
  new:      { Component: NewReleasesIcon, color: "#ffa500" },
  sale:     { Component: LocalOfferIcon,  color: "#ffa500" },
  wishlist: { Component: FavoriteIcon,    color: "#ff4d4d" },
};

// ✅ FIX #7 — Shared getInitials consistent with ProfilePage (up to 2 chars)
const getInitials = (name) =>
  name?.trim()
    ? name.trim().split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

/* ─────────────────────────────────────────────
   SEARCH STYLED COMPONENTS
───────────────────────────────────────────── */
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 30,
  backgroundColor: alpha(theme.palette.common.white, 0.12),
  border: `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
  width: 320,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  position: "absolute",
  height: "100%",
  display: "flex",
  alignItems: "center",
  pointerEvents: "none",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 5),
    fontSize: "0.95rem",
  },
}));

const menuItemStyle = {
  py: 1.2, px: 2,
  color: "rgba(255,255,255,0.85)",
  "&:hover": { backgroundColor: "rgba(255,165,0,0.08)", color: "#ffa500" },
  transition: "all 0.2s",
};
export default function NavBarMUI({ cartCount = 0, onCartClick, onLoginClick }) {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuAnchor,          setMenuAnchor]          = useState(null);
  const [profileAnchor,       setProfileAnchor]       = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [walletAnchor,        setWalletAnchor]        = useState(null);
  const [readingAnchor,       setReadingAnchor]       = useState(null);
  const [scrolled,            setScrolled]            = useState(false);

  // ✅ FIX #3 — State stores only plain data (iconType string), NOT JSX
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Romance Books",  message: "5 new romance books added",          time: "2 mins ago",  iconType: "new"      },
    { id: 2, title: "Flash Sale 50% OFF", message: "Science fiction books on sale",       time: "1 hour ago",  iconType: "sale"     },
    { id: 3, title: "Wishlist Alert",     message: "Book on your wishlist is now 30% off",time: "5 hours ago", iconType: "wishlist" },
  ]);

  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // ✅ FIX #5 — walletBalance stays a number; currency formatting happens in JSX only
  const [walletBalance] = useState(1200);

  const [currentlyReading] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", progress: 65 },
    { id: 2, title: "1984",             author: "George Orwell",        progress: 45 },
  ]);

  // ✅ FIX #10 — Search state wired up
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ FIX #2 & #6 — Functional updaters prevent stale closure bugs
  const handleNotificationClick = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  }, []);

  // ✅ useCallback — stable reference, won't re-trigger child useEffects
  const handleLogout = useCallback(() => {
    setProfileAnchor(null);
    logout();
    navigate("/");
  }, [logout, navigate]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? "rgba(11,11,11,0.95)" : "rgba(11,11,11,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,165,0,0.15)",
        }}
      >
        <Toolbar sx={{ minHeight: 70, justifyContent: "space-between" }}>

          {/* LOGO */}
          <Box display="flex" alignItems="center" gap={1}>
            <MenuBookIcon sx={{ color: "#ffa500", fontSize: 28 }} />
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="h5" sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                BOOKNEST
              </Typography>
            </Link>
          </Box>

          {/* NAV LINKS */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navLinks.map(n => (
              <Link key={n.path} to={n.path} style={{ textDecoration: "none", color: "white" }}>
                <Typography sx={{ "&:hover": { color: "#ffa500" } }}>{n.label}</Typography>
              </Link>
            ))}
          </Box>

          {/* ✅ FIX #10 — Search is now functional (Enter to search) */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase
                placeholder="Search books…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </Search>
          </Box>

          {/* RIGHT SIDE */}
          <Box display="flex" alignItems="center" gap={1}>

            <IconButton color="inherit"><DarkModeIcon /></IconButton>

            {/* NOTIFICATIONS */}
            {token && (
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={(e) => setNotificationsAnchor(e.currentTarget)}
                >
                  <Badge badgeContent={unreadNotifications} color="warning">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* READING PROGRESS */}
            {token && (
              <Tooltip title="Currently Reading">
                <IconButton
                  color="inherit"
                  onClick={(e) => setReadingAnchor(e.currentTarget)}
                >
                  <Badge badgeContent={currentlyReading.length} color="success">
                    <AutoStoriesIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* ✅ FIX #5 — Wallet uses Tooltip for currency, Badge shows number only */}
            {token && (
              <Tooltip title={`Wallet: ₹${walletBalance}`}>
                <IconButton
                  color="inherit"
                  onClick={(e) => setWalletAnchor(e.currentTarget)}
                >
                  <CardGiftcardIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* CART */}
            <IconButton color="inherit" onClick={onCartClick}>
              <Badge badgeContent={cartCount} color="warning">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {token ? (
              <>
                {/* PROFILE BUTTON */}
                <Tooltip title="Account">
                  <Box
                    onClick={(e) => setProfileAnchor(e.currentTarget)}
                    sx={{
                      display: "flex", alignItems: "center", gap: 0.8,
                      cursor: "pointer", px: 1.5, py: 0.6,
                      borderRadius: "30px",
                      border: "1px solid rgba(255,165,0,0.4)",
                      "&:hover": { backgroundColor: "rgba(255,165,0,0.1)" },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#ffa500", color: "#000", fontSize: "0.85rem", fontWeight: 800 }}>
                      {getInitials(user?.name)}
                    </Avatar>
                    <Typography sx={{ display: { xs: "none", sm: "block" }, color: "white" }}>
                      {user?.name?.split(" ")[0] || "User"}
                    </Typography>
                    <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "white" }} />
                  </Box>
                </Tooltip>

                {/* PROFILE MENU */}
                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    sx: {
                      mt: 1.5, minWidth: 220,
                      backgroundColor: "#1a1a1a",
                      border: "1px solid rgba(255,165,0,0.2)",
                      borderRadius: "12px",
                      color: "white",
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, color: "white" }}>
                      {user?.name || "User"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                      {user?.email || ""}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "rgba(255,165,0,0.15)", mx: 1 }} />

                  {profileMenu.map((item) => (
                    <MenuItem
                      key={item.label}
                      component={Link}
                      to={item.path}
                      onClick={() => setProfileAnchor(null)}
                      sx={menuItemStyle}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}

                  <Divider sx={{ borderColor: "rgba(255,165,0,0.15)", mx: 1, my: 0.5 }} />

                  <MenuItem onClick={handleLogout} sx={{ py: 1.2, px: 2, color: "#ff4d4d" }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LogoutIcon sx={{ color: "#ff4d4d", fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={onLoginClick}
                sx={{
                  color: "#ffa500",
                  borderColor: "rgba(255,165,0,0.5)",
                  borderRadius: "20px",
                  textTransform: "none",
                }}
              >
                Login
              </Button>
            )}

            {/* ✅ FIX #8 — display "flex" not "block" for IconButton */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* MOBILE MENU */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: {
              backgroundColor: "#1a1a1a",
              color: "white",
              border: "1px solid rgba(255,165,0,0.2)",
              borderRadius: "10px",
            },
          }}
        >
          {navLinks.map(n => (
            <MenuItem
              key={n.path}
              component={Link}
              to={n.path}
              onClick={() => setMenuAnchor(null)}
              sx={{ color: "white", "&:hover": { color: "#ffa500" } }}
            >
              {n.label}
            </MenuItem>
          ))}
        </Menu>
      </AppBar>

      {/* ── NOTIFICATIONS POPOVER ── */}
      <Popover
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={() => setNotificationsAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5, width: 350,
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255,165,0,0.2)",
            borderRadius: "12px",
            maxHeight: 450,
            overflowY: "auto",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,165,0,0.2)" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Notifications
          </Typography>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <Typography>No new notifications</Typography>
          </Box>
        ) : (
          notifications.map((notif) => {
            // ✅ FIX #3 — Icon resolved from type map, not stored as JSX
            const iconDef = NOTIF_ICONS[notif.iconType] || NOTIF_ICONS.new;
            const IconComp = iconDef.Component;
            return (
              <Box
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id)}
                sx={{
                  p: 2,
                  borderBottom: "1px solid rgba(255,165,0,0.1)",
                  "&:hover": { backgroundColor: "rgba(255,165,0,0.05)" },
                  display: "flex",
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Box sx={{ flexShrink: 0 }}>
                  <IconComp sx={{ color: iconDef.color }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                    {notif.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                    {notif.message}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "rgba(255,165,0,0.6)", mt: 0.5 }}>
                    {notif.time}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Popover>

      {/* ── READING PROGRESS POPOVER ── */}
      <Popover
        anchorEl={readingAnchor}
        open={Boolean(readingAnchor)}
        onClose={() => setReadingAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5, width: 340,
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255,165,0,0.2)",
            borderRadius: "12px",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,165,0,0.2)" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Currently Reading 📖
          </Typography>
        </Box>

        {currentlyReading.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <Typography>Start reading a book to track progress</Typography>
          </Box>
        ) : (
          currentlyReading.map((book) => (
            <Box key={book.id} sx={{ p: 2, borderBottom: "1px solid rgba(255,165,0,0.1)" }}>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {/* ✅ FIX #4 — Render actual cover image, fallback to placeholder box */}
                {book.cover ? (
                  <Box
                    component="img"
                    src={book.cover}
                    alt={book.title}
                    onError={(e) => { e.target.style.display = "none"; }}
                    sx={{
                      width: 50, height: 70,
                      borderRadius: "4px",
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "1px solid rgba(255,165,0,0.2)",
                    }}
                  />
                ) : (
                  <Box sx={{
                    width: 50, height: 70,
                    backgroundColor: "rgba(255,165,0,0.1)",
                    borderRadius: "4px",
                    flexShrink: 0,
                    border: "1px solid rgba(255,165,0,0.2)",
                  }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: "white", fontWeight: 600, mb: 0.5 }}>
                    {book.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                    {book.author}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "#ffa500" }}>
                        {book.progress}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                        {book.progress}/100
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={book.progress}
                      sx={{
                        backgroundColor: "rgba(255,165,0,0.1)",
                        "& .MuiLinearProgress-bar": { backgroundColor: "#ffa500" },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Popover>

      {/* ── WALLET POPOVER ── */}
      <Popover
        anchorEl={walletAnchor}
        open={Boolean(walletAnchor)}
        onClose={() => setWalletAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5, width: 300,
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255,165,0,0.2)",
            borderRadius: "12px",
          },
        }}
      >
        <Box sx={{
          background: "linear-gradient(135deg, #ffa500, #ff5e00)",
          color: "white", p: 2.5,
          borderRadius: "12px 12px 0 0",
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Wallet Balance</Typography>
          {/* ✅ FIX #5 — Currency formatted in JSX, walletBalance stays a number */}
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
            ₹{walletBalance.toLocaleString("en-IN")}
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: "white", mb: 2 }}>Quick Actions</Typography>
          <Button fullWidth variant="outlined" sx={{
            color: "#ffa500", borderColor: "rgba(255,165,0,0.5)", mb: 1,
            "&:hover": { backgroundColor: "rgba(255,165,0,0.1)" },
          }}>
            Add Money
          </Button>
          <Button fullWidth variant="outlined" sx={{
            color: "#ffa500", borderColor: "rgba(255,165,0,0.5)",
            "&:hover": { backgroundColor: "rgba(255,165,0,0.1)" },
          }}>
            View History
          </Button>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,165,0,0.2)" }} />

        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: "white", fontWeight: "bold", mb: 1 }}>
            Recent Transactions
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
            📕 Book Purchase: -₹299
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "rgba(255,255,255,0.4)", mb: 1 }}>
            2 days ago
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
            💳 Added via Card: +₹1,000
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "rgba(255,255,255,0.4)" }}>
            1 week ago
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
