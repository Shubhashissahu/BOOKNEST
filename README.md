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

## 🎯 Why BookNest?

Most beginner projects focus only on UI.  
**BookNest is designed as a complete system**, showcasing real-world development practices like:

- API design and integration  
- Full-stack architecture  
- Database modeling  
- End-to-end user flow  

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
- Add, remove, and update cart items  
- Persistent cart (stored in database)  
- Multi-step checkout flow  
- Order summary page  

### ⚙️ Backend Architecture
- MVC pattern (routes → controllers → models)  
- Middleware for authentication & error handling  
- Modular and scalable API design  

---

## 🏗️ Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT |
| Styling | Tailwind CSS / CSS Modules |

---

## 🧩 System Architecture
React Client
↓ 
(Axios API Calls)
Express Server
↓

Controllers → Models → MongoDB
