import dotenv from "dotenv";
dotenv.config(); // ← MUST be before ANY other import that needs env vars

import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import connectDB from "./config/db.js";
import "./config/passport.js"; // ← Only ONCE, after dotenv
import bookRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";

// Connect DB
connectDB();

const app = express();

// ─── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,      // ✅ process.env NOT env
  credentials: true
}));

app.use(express.json());

// ─── Session ───────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,  // ✅ process.env NOT env
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
app.use('/auth', authRoutes);        // ✅ OAuth routes (Google/Facebook)
app.use("/api/auth", authRoutes); 
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API Running ✅");
});

// ─── Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;  // ✅ process.env NOT env

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Loaded' : '❌ MISSING'}`);

  console.log(`MONGODB_URI:        ${process.env.MONGODB_URI         ? '✅ Loaded' : '❌ MISSING'}`);
});