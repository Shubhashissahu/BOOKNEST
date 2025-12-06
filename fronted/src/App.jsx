import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";

import NavbarComponent from "./Components/Navbar";
import LoginModal from "./Components/LoginModal";
import Footer from "./Components/Footer";
import ShoppingCartSheet from "./Components/ShoppingCartSheet";

// Pages
import HomePage from "./Pages/Home";
// import BooksPage from "./Pages/BooksPage";
import ContactPage from "./Pages/ContactPage";

function App() {
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        {/* 🍔 Navbar */}
      <NavbarComponent
  cartCount={cart.length}
  onCartClick={() => setShowCart(true)}
  onLoginClick={() => setShowLogin(true)}
/>


        {/* 🛒 Shopping Cart Sidebar */}
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
          onRemoveItem={(id) => setCart(cart.filter((item) => item.id !== id))}
        />

        {/* 🔐 Login Modal */}
        <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />

        {/* ✨ Main Content */}
        <Container as="main" className="flex-grow-1 mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/books" element={<BooksPage cart={cart} setCart={setCart} />} /> */}
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Container>

        {/* 📄 Footer */}
        <Footer />

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;