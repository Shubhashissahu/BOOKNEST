import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import connectDB from "./config/db.js";
import "./config/passport.js"; 
import bookRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from './routes/payment.js';

connectDB();

const app = express();

// ─── CORS ──────────────────────────────────────────────────
// ✅ FIX 1: Hardened CORS — handles missing CLIENT_URL gracefully
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.CLIENT_URL
    ].filter(Boolean);

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ FIX 2: Handle preflight OPTIONS requests — THIS was your main blocker
app.options(/.*/, cors());

app.use(express.json());

// ─── Session ───────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,  
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  }
}));

// ─── Passport ──────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ────────────────────────────────────────────────
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);        
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

// ✅ FIX 3: Log ALL critical env vars on startup — know immediately what's missing
const PORT = process.env.PORT || 5000;  

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`CLIENT_URL:        ${process.env.CLIENT_URL         ? `✅ ${process.env.CLIENT_URL}` : '❌ MISSING'}`);
  console.log(`GOOGLE_CLIENT_ID:  ${process.env.GOOGLE_CLIENT_ID   ? '✅ Loaded' : '❌ MISSING'}`);
  console.log(`MONGODB_URI:       ${process.env.MONGODB_URI         ? '✅ Loaded' : '❌ MISSING'}`);
  console.log(`JWT_SECRET:        ${process.env.JWT_SECRET          ? '✅ Loaded' : '❌ MISSING'}`);
  console.log(`SESSION_SECRET:    ${process.env.SESSION_SECRET      ? '✅ Loaded' : '❌ MISSING'}`);
});