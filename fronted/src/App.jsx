import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Toolbar,
} from "@mui/material";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import NavBarMUI from "./Components/NavBarMUI";
import LoginModal from "./Components/LoginModal";
import ShoppingCartSheet from "./Components/ShoppingCartSheet";
import Footer from "./Components/Footer";

// Pages
import HomePage from "./Pages/Home";
import BooksPage from "./Pages/BooksPage";
import ContactPage from "./Pages/ContactPage";

/* =====================
   MUI THEME
===================== */
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffa500",
    },
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
        {/* ================= NAVBAR ================= */}
        <NavBarMUI
          cartCount={cart.length}
          onCartClick={() => setShowCart(true)}
          onLoginClick={() => setShowLogin(true)}
        />

        {/* ================= CART DRAWER ================= */}
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

        {/* ================= LOGIN MODAL ================= */}
        <LoginModal
          show={showLogin}
          onClose={() => setShowLogin(false)}
        />

        {/* ================= MAIN CONTENT ================= */}
        <Box sx={{ minHeight: "100vh" }}>
          {/* Push content below AppBar */}
          <Toolbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/books"
              element={<BooksPage cart={cart} setCart={setCart} />}
            />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Box>

        {/* ================= FOOTER ================= */}
        <Footer />

        {/* ================= TOAST ================= */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
          style={{ zIndex: 20000 }} // ⭐ fixes toast hidden issue
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
