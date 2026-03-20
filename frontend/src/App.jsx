import React, { useState, useEffect,useContext } from "react";
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

// API
import {getCart,updateCartQuantity,removeFromCart} from "./api/cart";

// Components
import NavBarMUI from "./Components/NavBarMUI";
import LoginModal from "./Components/LoginModal";
import ShoppingCartSheet from "./Components/ShoppingCartSheet";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import LiveChat from "./Components/Livechat";
import { AuthContext } from "./context/AuthContext";
// Pages
import HomePage from "./Pages/Home";
import BooksPage from "./Pages/BooksPage";
import ContactPage from "./Pages/ContactPage";
import DashboardPage from "./Pages/DashboardPage";
import ProfilePage from "./Pages/ProfilePage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrdersPage   from "./Pages/OrdersPage";
import SettingsPage from "./Pages/SettingsPage";
//mui theme
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
  const [cartItems, setCartItems] = useState([]);
  const { userToken, user } = useContext(AuthContext);

//fetch cart
  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await getCart(token);
      setCartItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  //load when cart is open
  useEffect(() => {

    if (showCart) {
      fetchCart();
    }
  }, [showCart]);

//update quanity
  const handleUpdateQuantity = async (id, qty) => {
     const token = localStorage.getItem("token");
    try {
      await updateCartQuantity(id, qty, token);
      fetchCart();

    } catch (error) {
      console.error(error);
    }
  };
//remove item
  const handleRemoveItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await removeFromCart(id, token);
      fetchCart();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>

        {/*  NAVBAR */}
        <NavBarMUI
          cartCount={cartItems.length}
          onCartClick={() => setShowCart(true)}
          onLoginClick={() => setShowLogin(true)}
        />

        {/* CART*/}
        <ShoppingCartSheet
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        {/*  LOGIN  */}
        <LoginModal
          show={showLogin}
          onClose={() => setShowLogin(false)}
        />

        {/* MAIN  */}
        <Box sx={{ minHeight: "100vh" }}>
          <Toolbar />

          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/books"
              element={<BooksPage />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

<Route path="/checkout" element={
  <ProtectedRoute>
    <CheckoutPage onOrderPlaced={() => setCartItems([])} /> {/* ← remove cartItems prop */}
  </ProtectedRoute>
} />
<Route path="/orders" element={
  <ProtectedRoute>
    <OrdersPage />
  </ProtectedRoute>
} />
<Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={<ContactPage />}
            />
          </Routes>
        </Box>
        {/* FOOTER  */}
        <Footer />

        {/*  TOAST  */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
          style={{ zIndex: 20000 }}
        />

      </Router>
      <LiveChat 
        userToken={userToken} 
        userName={user?.name || "User"}
      />
    </ThemeProvider>
  );
}
export default App;