import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Toolbar } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";

// MUI Navbar
import NavBarMUI from "./Components/NavBarMUI";

// Components
import LoginModal from "./Components/LoginModal";
import ShoppingCartSheet from "./Components/ShoppingCartSheet";
import Footer from "./Components/Footer";

// Pages
import HomePage from "./Pages/Home";
import ContactPage from "./Pages/ContactPage";
import BooksPage from "./Pages/BooksPage";

// Theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ffa500" },
    background: {
      default: "#0d0d0d",
      paper: "#111",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

function App() {
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cart, setCart] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        {/* ✅ FIXED NAVBAR */}
        <NavBarMUI
          cartCount={cart.length}
          onCartClick={() => setShowCart(true)}
          onLoginClick={() => setShowLogin(true)}
        />

        {/* 🛒 Cart Drawer */}
        <ShoppingCartSheet
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cartItems={cart}
          onUpdateQuantity={(id, qty) => {
            if (qty > 0) {
              setCart((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, quantity: qty } : item
                )
              );
            }
          }}
          onRemoveItem={(id) =>
            setCart((prev) => prev.filter((item) => item.id !== id))
          }
        />

        {/* 🔐 Login Modal */}
        <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />

        {/* ✅ MAIN CONTENT (PUSHED BELOW NAVBAR) */}
      <Box sx={{ minHeight: "100vh" }}>
  <Toolbar /> {/* exact AppBar height */}
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/books" element={<BooksPage />} />
    <Route path="/contact" element={<ContactPage />} />
  </Routes>
</Box>


        {/* Footer */}
        <Footer />

        {/* Toast */}
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
