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
import { Link, useLocation } from "react-router-dom";

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
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.18),
    boxShadow: `0 0 18px ${alpha(theme.palette.primary.main, 0.35)}`,
  },
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

export default function ModernNavBar({
  cartCount = 0,
  onCartClick,
  onLoginClick,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToCategories = () => {
    if (location.pathname !== "/") {
      window.location.href = "/?scroll=categories";
    } else {
      window.goToCategories?.();
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Books", path: "/books" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: scrolled
          ? "rgba(11,11,11,0.95)"
          : "rgba(11,11,11,0.75)",
        backdropFilter: "blur(12px)",
        transition: "0.3s",
        borderBottom: scrolled
          ? "1px solid rgba(255,165,0,0.2)"
          : "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 70 }}>
        
        {/* LOGO */}
        <Box display="flex" alignItems="center" gap={1.2}>
          <MenuBookIcon sx={{ color: "#ffa500", fontSize: 30 }} />
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

        {/* DESKTOP LINKS */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3.5,
            alignItems: "center",
          }}
        >
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

          <Typography
            sx={{ cursor: "pointer", "&:hover": { color: "#ffa500" } }}
            onClick={goToCategories}
          >
            Categories
          </Typography>
        </Box>

        {/* SEARCH (DESKTOP) */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search books…" />
          </Search>
        </Box>

        {/* ICONS */}
        <Box display="flex" alignItems="center" gap={1.5}>
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

          {/* MOBILE MENU */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* MOBILE MENU DROPDOWN */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          sx={{
            "& .MuiPaper-root": {
              background: "rgba(20,20,20,0.95)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          {navLinks.map((item) => (
            <MenuItem key={item.path} onClick={() => setMenuAnchor(null)}>
              <Link
                to={item.path}
                style={{ textDecoration: "none", color: "white" }}
              >
                {item.label}
              </Link>
            </MenuItem>
          ))}

          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              goToCategories();
            }}
          >
            Categories
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* MOBILE SEARCH */}
      <Box sx={{ display: { xs: "block", sm: "none" }, px: 2, pb: 1 }}>
        <Search sx={{ width: "100%" }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search books…" />
        </Search>
      </Box>
    </AppBar>
  );
}
