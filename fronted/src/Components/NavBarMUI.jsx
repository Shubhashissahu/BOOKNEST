import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Link} from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";

/* ---------------- STYLED SEARCH ---------------- */

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

/* ---------------- NAVBAR ---------------- */

export default function NavBarMUI({
  cartCount = 0,
  onCartClick,
  onLoginClick,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Books", path: "/books" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <AppBar
      position="fixed"   // ✅ FIXED (not sticky)
      elevation={0}
      sx={{
        background: scrolled
          ? "rgba(11,11,11,0.95)"
          : "rgba(11,11,11,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,165,0,0.15)",
      }}
    >
      <Toolbar sx={{ minHeight: 70, justifyContent: "space-between" }}>
        {/* LOGO */}
        <Box display="flex" alignItems="center" gap={1}>
          <MenuBookIcon sx={{ color: "#ffa500", fontSize: 28 }} />
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg,#ffa500,#ff5e00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BOOKNEST
            </Typography>
          </Link>
        </Box>

        {/* LINKS */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Typography sx={{ "&:hover": { color: "#ffa500" } }}>
                {item.label}
              </Typography>
            </Link>
          ))}
        </Box>

        {/* SEARCH */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search books…" />
          </Search>
        </Box>

        {/* ICONS */}
        <Box display="flex" gap={1}>
          <IconButton color="inherit">
            <DarkModeIcon />
          </IconButton>

          <IconButton color="inherit" onClick={onLoginClick}>
            <AccountCircleIcon />
          </IconButton>

          <IconButton color="inherit" onClick={onCartClick}>
            <Badge badgeContent={cartCount} color="warning">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            sx={{ display: { xs: "block", md: "none" } }}
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
      >
        {navLinks.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMenuAnchor(null)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
