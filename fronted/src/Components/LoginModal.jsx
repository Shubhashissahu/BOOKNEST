import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function LoginModal({ show, onClose }) {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header style={{ background: '#1e3a8a', color: 'white' }}>
                <Modal.Title>{isLogin ? 'Login' : 'Register'}</Modal.Title>
                <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={onClose}
                ></button>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your password" />
                    </Form.Group>
                    <Button 
                        variant={isLogin ? "primary" : "success"} 
                        className="w-100 mb-3"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </Button>
                </Form>
                <p className="text-center">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <a href="#" onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
                        {isLogin ? 'Register here' : 'Login here'}
                    </a>
                </p>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;