import React, { useState, useEffect, useContext, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ThemeProvider, createTheme, CssBaseline, Box, Toolbar,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getCart, updateCartQuantity, removeFromCart } from "./api/cart";

import NavBarMUI           from "./Components/NavBarMUI";
import LoginModal          from "./Components/LoginModal";
import ShoppingCartSheet   from "./Components/ShoppingCartSheet";
import Footer              from "./Components/Footer";
import ProtectedRoute      from "./Components/ProtectedRoute";
import LiveChat            from "./Components/Livechat";
import { AuthContext }     from "./context/AuthContext";

import HomePage      from "./Pages/Home";
import BooksPage     from "./Pages/BooksPage";
import ContactPage   from "./Pages/ContactPage";
import DashboardPage from "./Pages/DashboardPage";
import ProfilePage   from "./Pages/ProfilePage";
import CheckoutPage  from "./Pages/CheckoutPage";
import OrdersPage    from "./Pages/OrdersPage";
import SettingsPage  from "./Pages/SettingsPage";
import OAuthCallback from "./Pages/OAuthCallback";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary:    { main: "#ffa500" },
    background: { default: "#0d0d0d", paper: "#111" },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

function App() {
  const [showCart,  setShowCart]  = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const { token, user } = useContext(AuthContext);

  // ✅ FIX #2 & #3 — Uses context token, stable with useCallback
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getCart(token);
      setCartItems(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchCart();
    if (!token) setCartItems([]); // clear cart on logout
  }, [token, fetchCart]);

  // Load when cart drawer is opened
  useEffect(() => {
    if (showCart) fetchCart();
  }, [showCart, fetchCart]);

  const handleUpdateQuantity = async (id, qty) => {
    try {
      await updateCartQuantity(id, qty, token); 
      fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id, token); // ✅ FIX #2
      fetchCart();
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBarMUI
          cartCount={cartItems.length}
          onCartClick={() => setShowCart(true)}
          onLoginClick={() => setShowLogin(true)}
        />

        <ShoppingCartSheet
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        <LoginModal
          show={showLogin}
          onClose={() => setShowLogin(false)}
        />

        <Box sx={{ minHeight: "100vh" }}>
          <Toolbar />
          <Routes>
            <Route path="/"        element={<HomePage />} />
            <Route path="/books"   element={<BooksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><OrdersPage /></ProtectedRoute>
            } />
            {/* ✅ FIX #7 — Settings now protected */}
            <Route path="/settings" element={
              <ProtectedRoute><SettingsPage /></ProtectedRoute>
            } />
            {/* ✅ FIX #8 — Stale comment removed */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage onOrderPlaced={() => setCartItems([])} />
              </ProtectedRoute>
            } />
          </Routes>
        </Box>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={2000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
          style={{ zIndex: 20000 }}
        />
        <LiveChat
          userToken={token}
          userName={user?.name || "User"}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;