import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { 
  FaBook, 
  FaBolt, 
  FaMoneyBillWave, 
  FaLock, 
  FaBookOpen, 
  FaFlask, 
  FaLandmark, 
  FaLightbulb, 
  FaBriefcase, 
  FaPlus 
} from "react-icons/fa";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      {/* 🎯 Hero Section */}
      <section className="text-center text-white py-5" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)" }}>
        <Container>
          <h1 className="display-3 fw-bold mb-4">Welcome to BookStore</h1>
          <p className="lead mb-5 fs-5">
            Discover thousands of books and read them online instantly
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/books">
              <Button variant="light" size="lg" className="fw-bold">Explore Books</Button>
            </Link>
            <Button variant="outline-light" size="lg" className="fw-bold border-2">Learn More</Button>
          </div>
        </Container>
      </section>

      {/* ✨ Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5 fs-1">Why Choose BookStore?</h2>
          <Row>
            {[
              { icon: <FaBook size={50} className="text-primary mb-3" />, title: "Huge Collection", text: "Access thousands of books across all genres and categories" },
              { icon: <FaBolt size={50} className="text-success mb-3" />, title: "Fast Access", text: "Read books instantly without waiting or downloading" },
              { icon: <FaMoneyBillWave size={50} className="text-warning mb-3" />, title: "Affordable", text: "Best prices with special discounts and offers" },
              { icon: <FaLock size={50} className="text-danger mb-3" />, title: "Secure", text: "Your data and transactions are protected" },
            ].map((feature, index) => (
              <Col md={6} lg={3} className="mb-4" key={index}>
                <Card className="text-center p-4 shadow-sm border-0 h-100 feature-card">
                  {feature.icon}
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted">{feature.text}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🏆 Categories Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5 fs-1">Popular Categories</h2>
          <Row>
            {[
              { name: "Fiction", icon: <FaBookOpen size={40} />, color: "primary" },
              { name: "Science", icon: <FaFlask size={40} />, color: "success" },
              { name: "History", icon: <FaLandmark size={40} />, color: "warning" },
              { name: "Self-Help", icon: <FaLightbulb size={40} />, color: "danger" },
              { name: "Business", icon: <FaBriefcase size={40} />, color: "secondary" },
              { name: "More", icon: <FaPlus size={40} />, color: "info" },
            ].map((category, index) => (
              <Col md={6} lg={4} className="mb-4" key={index}>
                <Link to="/books" className="text-decoration-none">
                  <Card className="text-center p-5 border border-2 h-100 category-card">
                    <div className={`mb-3 text-${category.color}`}>{category.icon}</div>
                    <h5 className={`fw-bold text-${category.color}`}>{category.name}</h5>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 📊 Stats Section */}
      <section className="py-5 text-white" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)" }}>
        <Container>
          <Row className="text-center">
            {[
              { value: "50K+", label: "Books Available" },
              { value: "100K+", label: "Happy Readers" },
              { value: "24/7", label: "Customer Support" },
              { value: "100%", label: "Secure & Safe" },
            ].map((stat, index) => (
              <Col md={3} className="mb-4" key={index}>
                <h3 className="fw-bold fs-1">{stat.value}</h3>
                <p className="fs-6">{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🎁 Call to Action */}
      <section className="py-5 bg-light text-center">
        <Container>
          <h2 className="fw-bold mb-4 fs-1">Start Reading Today!</h2>
          <p className="text-muted mb-4 fs-6">
            Join thousands of readers who enjoy unlimited access to our collection
          </p>
          <Link to="/books">
            <Button className="btn-lg fw-bold" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)", border: "none", padding: "12px 40px" }}>
              Browse All Books
            </Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}

export default HomePage;