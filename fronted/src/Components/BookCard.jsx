import React from 'react';
import { Card } from 'react-bootstrap';

function BookCard({ book, onViewClick, onAddToCart, onWishlist }) {
    return (
        <Card className="book-card h-100" style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}>
            <Card.Img 
                variant="top" 
                src={book.cover} 
                style={{ height: '250px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title className="fw-bold" style={{ color: '#1e3a8a' }}>
                    {book.title}
                </Card.Title>
                <Card.Subtitle className="text-muted mb-3">
                    by {book.author}
                </Card.Subtitle>
                <h5 className="fw-bold" style={{ color: '#10b981', fontSize: '1.5rem' }}>
                    ₹{book.price}
                </h5>
                <div className="d-grid gap-2 mt-3">
                    <button 
                        className="btn btn-primary"
                        onClick={() => onViewClick(book)}
                    >
                        <i className="fas fa-eye me-2"></i> View & Read
                    </button>
                    <button 
                        className="btn btn-success"
                        onClick={() => onAddToCart(book)}
                    >
                        <i className="fas fa-shopping-cart me-2"></i> Add to Cart
                    </button>
                    <button 
                        className="btn btn-danger"
                        onClick={() => onWishlist(book)}
                    >
                        <i className="fas fa-heart me-2"></i> Wishlist
                    </button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default BookCard;