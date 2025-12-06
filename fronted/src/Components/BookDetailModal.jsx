import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

function BookDetailModal({ show, book, onClose, onAddToCart }) {
    if (!book) return null;

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header style={{ background: '#1e3a8a', color: 'white' }}>
                <Modal.Title>{book.title}</Modal.Title>
                <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={onClose}
                ></button>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={4}>
                        <img 
                            src={book.cover} 
                            alt={book.title}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                    </Col>
                    <Col md={8}>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Category:</strong> {book.category.toUpperCase()}</p>
                        <p><strong>Pages:</strong> {book.pages}</p>
                        <p>
                            <strong>Price:</strong> 
                            <span style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 'bold', marginLeft: '10px' }}>
                                ₹{book.price}
                            </span>
                        </p>
                        <p><strong>Description:</strong></p>
                        <p>{book.description}</p>
                        <p>
                            <strong>Rating:</strong> 
                            <span style={{ color: '#fbbf24', marginLeft: '10px' }}>
                                ★★★★★ ({book.rating}/5)
                            </span>
                        </p>
                    </Col>
                </Row>
                <div className="mt-4" style={{ textAlign: 'center' }}>
                    <h6>Preview Available - First 3 Pages Free</h6>
                    <div style={{
                        height: '300px',
                        background: '#f0f0f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999'
                    }}>
                        📄 PDF Preview will load here
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="success" 
                    size="lg"
                    onClick={() => {
                        onAddToCart(book);
                        onClose();
                    }}
                    style={{ width: '100%' }}
                >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add to Cart - ₹{book.price}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BookDetailModal;