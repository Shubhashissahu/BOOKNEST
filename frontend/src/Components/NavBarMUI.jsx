import React, { useState, useEffect, useContext } from "react";
import {
  AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge,
  Menu, MenuItem, Avatar, Divider, ListItemIcon, ListItemText,
  Button, Tooltip
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { AuthContext } from "../context/AuthContext";

/* SEARCH */
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
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 5),
    fontSize: "0.95rem",
  },
}));

export default function NavBarMUI({ cartCount = 0, onCartClick, onLoginClick }) {

  const { userToken, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Books", path: "/books" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Contact", path: "/contact" },
  ];

  const profileMenu = [
    { label: "My Profile", path: "/profile", icon: <AccountCircleIcon sx={{ color:"#ffa500",fontSize:20 }}/> },
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon sx={{ color:"#ffa500",fontSize:20 }}/> },
    { label: "Wishlist", path: "/wishlist", icon: <FavoriteIcon sx={{ color:"#ffa500",fontSize:20 }}/> },
    { label: "Settings", path: "/settings", icon: <SettingsIcon sx={{ color:"#ffa500",fontSize:20 }}/> },
  ];

  const menuItemStyle = {
    py:1.2, px:2,
    color:"rgba(255,255,255,0.85)",
    "&:hover":{backgroundColor:"rgba(255,165,0,0.08)",color:"#ffa500"},
    transition:"all 0.2s"
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    setProfileAnchor(null);
    logout();
    navigate("/");
  };

  return (
    <AppBar position="fixed" elevation={0}
      sx={{
        background: scrolled ? "rgba(11,11,11,0.95)" : "rgba(11,11,11,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,165,0,0.15)",
      }}
    >

      <Toolbar sx={{ minHeight:70, justifyContent:"space-between" }}>

        {/* LOGO */}
        <Box display="flex" alignItems="center" gap={1}>
          <MenuBookIcon sx={{ color:"#ffa500", fontSize:28 }}/>
          <Link to="/" style={{ textDecoration:"none" }}>
            <Typography variant="h5"
              sx={{
                fontWeight:700,
                background:"linear-gradient(90deg,#ffa500,#ff5e00)",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent"
              }}>
              BOOKNEST
            </Typography>
          </Link>
        </Box>

        {/* NAV LINKS */}
        <Box sx={{ display:{ xs:"none", md:"flex"}, gap:3 }}>
          {navLinks.map(n => (
            <Link key={n.path} to={n.path} style={{ textDecoration:"none", color:"white" }}>
              <Typography sx={{ "&:hover":{color:"#ffa500"} }}>{n.label}</Typography>
            </Link>
          ))}
        </Box>

        {/* SEARCH */}
        <Box sx={{ display:{ xs:"none", sm:"block" } }}>
          <Search>
            <SearchIconWrapper><SearchIcon/></SearchIconWrapper>
            <StyledInputBase placeholder="Search books…" />
          </Search>
        </Box>

        {/* RIGHT SIDE */}
        <Box display="flex" alignItems="center" gap={1}>

          <IconButton color="inherit"><DarkModeIcon/></IconButton>

          <IconButton color="inherit" onClick={onCartClick}>
            <Badge badgeContent={cartCount} color="warning">
              <ShoppingCartIcon/>
            </Badge>
          </IconButton>

          {userToken ? (
            <>
              {/* PROFILE BUTTON */}
              <Tooltip title="Account">
                <Box onClick={(e)=>setProfileAnchor(e.currentTarget)}
                  sx={{
                    display:"flex",alignItems:"center",gap:0.8,cursor:"pointer",
                    px:1.5,py:0.6,borderRadius:"30px",
                    border:"1px solid rgba(255,165,0,0.4)",
                    "&:hover":{backgroundColor:"rgba(255,165,0,0.1)"}
                  }}>
                  <Avatar sx={{width:32,height:32,bgcolor:"#ffa500",color:"#000"}}>
                    {getInitials(user?.name)}
                  </Avatar>
                  <Typography sx={{ display:{xs:"none",sm:"block"} }}>
                    {user?.name?.split(" ")[0] || "User"}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{fontSize:18}}/>
                </Box>
              </Tooltip>

              {/* PROFILE MENU */}
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={()=>setProfileAnchor(null)}
                transformOrigin={{horizontal:"right",vertical:"top"}}
                anchorOrigin={{horizontal:"right",vertical:"bottom"}}
                PaperProps={{
                  sx:{
                    mt:1.5,minWidth:220,
                    backgroundColor:"#1a1a1a",
                    border:"1px solid rgba(255,165,0,0.2)",
                    borderRadius:"12px",color:"white"
                  }
                }}
              >

                <Box sx={{ px:2, py:1.5 }}>
                  <Typography sx={{fontWeight:700}}>
                    {user?.name || "User"}
                  </Typography>
                  <Typography sx={{fontSize:"0.78rem",color:"rgba(255,255,255,0.45)"}}>
                    {user?.email || "you@gmail.com"}
                  </Typography>
                </Box>

                <Divider sx={{borderColor:"rgba(255,165,0,0.15)",mx:1}}/>

                {profileMenu.map((item)=>(
                  <MenuItem
                    key={item.label}
                    component={Link}
                    to={item.path}
                    onClick={()=>setProfileAnchor(null)}
                    sx={menuItemStyle}
                  >
                    <ListItemIcon sx={{minWidth:36}}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label}/>
                  </MenuItem>
                ))}

                <Divider sx={{borderColor:"rgba(255,165,0,0.15)",mx:1,my:0.5}}/>

                <MenuItem onClick={handleLogout}
                  sx={{py:1.2,px:2,color:"#ff4d4d"}}>
                  <ListItemIcon sx={{minWidth:36}}>
                    <LogoutIcon sx={{color:"#ff4d4d",fontSize:20}}/>
                  </ListItemIcon>
                  <ListItemText primary="Sign Out"/>
                </MenuItem>

              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={onLoginClick}
              sx={{
                color:"#ffa500",
                borderColor:"rgba(255,165,0,0.5)",
                borderRadius:"20px",
                textTransform:"none"
              }}>
              Login
            </Button>
          )}

          <IconButton
            color="inherit"
            sx={{ display:{ xs:"block", md:"none"} }}
            onClick={(e)=>setMenuAnchor(e.currentTarget)}
          >
            <MenuIcon/>
          </IconButton>

        </Box>
      </Toolbar>

      {/* MOBILE MENU */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={()=>setMenuAnchor(null)}
        PaperProps={{
          sx:{
            backgroundColor:"#1a1a1a",
            color:"white",
            border:"1px solid rgba(255,165,0,0.2)",
            borderRadius:"10px"
          }
        }}
      >
        {navLinks.map(n=>(
          <MenuItem
            key={n.path}
            component={Link}
            to={n.path}
            onClick={()=>setMenuAnchor(null)}
            sx={{ "&:hover":{color:"#ffa500"} }}
          >
            {n.label}
          </MenuItem>
        ))}
      </Menu>

    </AppBar>
  );
}