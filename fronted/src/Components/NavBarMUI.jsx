import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import BookIcon from "@mui/icons-material/MenuBook";

import { styled, alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 30,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  maxWidth: 300,
  transition: "0.3s",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  position: "absolute",
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 4),
  },
}));

export default function NavbarComponent({ cartCount, onCartClick, onLoginClick }) {
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const openMenu = (event) => setMenuAnchor(event.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "#0b0b0b",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT — LOGO */}
        <Box display="flex" alignItems="center" gap={1}>
          <BookIcon sx={{ color: "orange", fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg,#ffa500,#ff5e00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
          >
            BOOKNEST
          </Typography>
        </Box>

        {/* CENTER — NAVIGATION (Desktop Only) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 4,
            fontWeight: 500,
          }}
        >
          {["Home", "Categories", "Best Sellers", "New Arrivals", "Contact"].map(
            (item) => (
              <Typography
                key={item}
                sx={{
                  cursor: "pointer",
                  color: "white",
                  "&:hover": { color: "orange" },
                }}
              >
                {item}
              </Typography>
            )
          )}
        </Box>

        {/* SEARCH BAR */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search books…" />
        </Search>

        {/* RIGHT — ICONS */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit">
            <DarkModeIcon />
          </IconButton>

          <IconButton color="inherit" onClick={onLoginClick}>
            <AccountCircle />
          </IconButton>

          <IconButton color="inherit" onClick={onCartClick}>
            <Badge badgeContent={cartCount} color="warning">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={openMenu}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* MOBILE MENU */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
        >
          {["Home", "Categories", "Best Sellers", "New Arrivals", "Contact"].map(
            (item) => (
              <MenuItem key={item} onClick={closeMenu}>
                {item}
              </MenuItem>
            )
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
