import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
    return (
        <footer style={{ background: '#1e3a8a', color: 'white', padding: '40px 0', marginTop: '60px' }}>
            <Container>
                <Row>
                    <Col md={3} className="mb-4">
                        <h6 className="fw-bold mb-3">About Us</h6>
                        <p>BookStore is your ultimate destination for reading books online with thousands of titles available.</p>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h6 className="fw-bold mb-3">Quick Links</h6>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Home</a></li>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Books</a></li>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Pricing</a></li>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>FAQ</a></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h6 className="fw-bold mb-3">Support</h6>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Contact Us</a></li>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Help Center</a></li>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Privacy Policy</a></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h6 className="fw-bold mb-3">Follow Us</h6>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}><i className="fab fa-facebook me-2"></i>Facebook</a></li>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}><i className="fab fa-twitter me-2"></i>Twitter</a></li>
                            <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}><i className="fab fa-instagram me-2"></i>Instagram</a></li>
                        </ul>
                    </Col>
                </Row>
                <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <div className="text-center">
                    <p>&copy; 2025 BookStore. All Rights Reserved.</p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;