# 📚 BookNest  

> *A scalable, full-stack online bookstore built with the MERN stack — designed for real-world e-commerce performance.*

---

## 🚀 Overview

**BookNest** is a modern e-commerce platform for discovering and purchasing books, built using the MERN stack.  
It focuses on **performance, clean architecture, and production-readiness**, going beyond basic CRUD applications.

This project demonstrates:
- Scalable backend architecture  
- Secure authentication  
- Optimized search and filtering  
- Persistent cart and checkout workflows  

---

##  Key Features

### 🔐 Authentication & Security
- JWT-based login and registration  
- Protected routes (frontend + backend)  
- Secure password handling  
- Password reset via email  

### 🔍 Search & Filtering
- Real-time search (debounced API calls)  
- Filter by category, price, rating, availability  
- Sorting (price, newest, relevance)  

### 🛒 Cart & Checkout
- Add, update, and remove cart items (persisted server-side per user)
- Checkout flow with order placement
- Simulated payment processing with transaction records and emailed receipts (PDF via `pdfkit`, email via `nodemailer`) — **note:** this is a mock payment flow (`processPayment` generates a fake transaction ID and does not call a real payment gateway), not a Stripe/Razorpay integration 

### ⚙️ Backend Architecture
- MVC pattern (routes → controllers → models)  
- Middleware for authentication & error handling  
- Modular and scalable API design  

---
## 🏗️ Tech Stack
 
| Layer          | Technology |
| -------------- | ---------- |
| Frontend       | React 19, Vite, React Router 7, Material UI (MUI) 7, Framer Motion |
| Backend        | Node.js, Express 5 |
| Database       | MongoDB (Mongoose) |
| Auth           | JWT, Passport.js (Google OAuth 2.0), bcryptjs, express-session + connect-mongo |
| File/Media     | Cloudinary, Multer, react-pdf / pdfjs-dist |
| Email & PDFs   | Nodemailer, PDFKit |
| Security       | Helmet, express-rate-limit |
 
---

## 📂 Project Structure
 
```
BOOKNEST/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, passport.js
│   │   ├── controllers/     # auth, book, cart, order, payment, contact
│   │   ├── middleware/      # auth.js (JWT "protect" middleware)
│   │   ├── models/          # User, Book, Order, Transaction, Cart, Contact
│   │   ├── routes/          # /api/auth, /api/books, /api/cart, /api/orders, /api/payment
│   │   ├── utils/           # email.js
│   │   └── server.js        # Express app entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── Components/      # NavBar, BookCard, PaymentModal, LiveChat, etc.
    │   ├── Pages/           # Home, BooksPage, ContactPage, Dashboard, Orders, Profile, Settings, Checkout
    │   ├── Services/        # googleBooksApi, openLibrary, semanticScholar
    │   ├── api/              # axios wrappers for auth, cart, orders
    │   ├── context/          # AuthContext
    │   └── App.jsx
    └── package.json
```

## 🧩 Architecture
 
```
React Client (Vite)
      │  Axios
      ▼
Express Server  ──▶  Helmet / CORS / Rate Limiting
      │
      ▼
Routes ──▶ Controllers ──▶ Models ──▶ MongoDB
      │
      ▼
Passport (Google OAuth) + JWT middleware
```
