import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Container
} from "react-bootstrap";
import {
  FaBookOpen,
  FaSearch,
  FaMoon,
  FaUser,
  FaShoppingCart
} from "react-icons/fa";

function NavbarComponent({ cartCount, onCartClick, onLoginClick }) {
  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm py-3">
        <Container fluid>
          
          {/* Logo */}
          <Navbar.Brand
            href="/"
            className="d-flex align-items-center text-orange fw-semibold"
          >
            <FaBookOpen className="text-warning me-2 fs-4" />
            <span className="text-brown fs-5">BOOKNEST</span>
          </Navbar.Brand>

          {/* Responsive Toggle */}
          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            
            {/* Navigation Links */}
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/categories">Categories</Nav.Link>
              <Nav.Link href="/best-sellers">Best Sellers</Nav.Link>
              <Nav.Link href="/new-arrivals">New Arrivals</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>

            {/* Search Bar */}
            <Form className="d-flex me-3">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaSearch className="text-muted" />
                </span>
                <FormControl
                  type="search"
                  placeholder="Search books..."
                  className="border-0 bg-light"
                  aria-label="Search"
                />
              </div>
            </Form>

            {/* Icons Section */}
            <div className="d-flex align-items-center gap-3 fs-5">
              
              {/* Dark Mode Icon */}
              <FaMoon
                className="text-dark"
                style={{ cursor: "pointer" }}
                title="Dark Mode"
              />

              {/* Login Icon */}
              <FaUser
                className="text-dark"
                style={{ cursor: "pointer" }}
                title="Login"
                onClick={onLoginClick}
              />

              {/* Cart Icon */}
              <div
                className="position-relative"
                style={{ cursor: "pointer" }}
                onClick={onCartClick}
              >
                <FaShoppingCart
                  className="text-dark"
                  title="Cart"
                />

                {/* Cart Count Badge */}
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
