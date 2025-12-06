import React from 'react';
import { Container } from 'react-bootstrap';

function HeroSection() {
    return (
    <section className="py-5 bg-light">
      <div className="container text-center text-md-start">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <h1 className="fw-bold text-dark">Discover Your Next Great Read</h1>
            <p className="lead text-muted">
              Explore thousands of books across all genres. Find your perfect book today.
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-warning">Browse Collection</button>
              <button className="btn btn-outline-dark">View Best Sellers</button>
            </div>
          </div>
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1628977613138-dcfede720de7"
              alt="Bookstore"
              className="img-fluid rounded shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;