import dotenv from "dotenv";
dotenv.config();

import express  from "express";
import cors     from "cors";
import session  from "express-session";
import helmet   from "helmet";           // ✅ FIX #7 — npm i helmet
import rateLimit from "express-rate-limit"; // ✅ FIX #6 — npm i express-rate-limit
import MongoStore from "connect-mongo";
import passport from "passport";

import connectDB     from "./config/db.js";
import "./config/passport.js";
import bookRoutes    from "./routes/books.js";
import authRoutes    from "./routes/auth.js";
import cartRoutes    from "./routes/cart.js";
import orderRoutes   from "./routes/orders.js";
import paymentRoutes from "./routes/payment.js";

// ✅ FIX #4 — crash on DB failure instead of running blind
connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

const app = express();

// ─── Security Headers ───────────────────────────────────────

app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ FIX #9 — standard wildcard syntax
app.options(/.*/, cors());
// ─── Body Parsing ────────────────────────────────────────────
// ✅ FIX #5 — payload size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Rate Limiting ───────────────────────────────────────────

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:        { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders:   false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders:   false,
});

app.use("/api",               globalLimiter);
app.use("/api/auth/login",    authLimiter);
app.use("/api/auth/register", authLimiter);

// ─── Session ─────────────────────────────────────────────────
app.use(session({
  // ✅ FIX #2 — fallback with loud warning
  secret: process.env.SESSION_SECRET || (() => {
    console.warn("⚠️  SESSION_SECRET missing — using insecure fallback");
    return "insecure-fallback-change-me";
  })(),
  resave:            false,
  saveUninitialized: false,
  // ✅ FIX #8 — MongoStore with encryption + lazy update
  store: MongoStore.create({
    mongoUrl:    process.env.MONGODB_URI,
    touchAfter:  24 * 3600,
    crypto:      { secret: process.env.SESSION_SECRET || "fallback" },
  }),
  cookie: {
    maxAge:   1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
}));

// ─── Passport ────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/books",   bookRoutes);
app.use("/api/auth",    authRoutes);
app.use("/api/cart",    cartRoutes);
app.use("/api/orders",  orderRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.send("API Running ✅"));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error(" Unhandled error:", err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`CLIENT_URL:       ${process.env.CLIENT_URL      ? `✅ ${process.env.CLIENT_URL}` : "❌ MISSING"}`);
  console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "✅ Loaded"                   : "❌ MISSING"}`);
  console.log(`MONGODB_URI:      ${process.env.MONGODB_URI      ? "✅ Loaded"                   : "❌ MISSING"}`);
  console.log(`JWT_SECRET:       ${process.env.JWT_SECRET       ? "✅ Loaded"                   : "❌ MISSING"}`);
  console.log(`SESSION_SECRET:   ${process.env.SESSION_SECRET   ? "✅ Loaded"                   : "❌ MISSING"}`);
});

// ✅ FIX #10 — graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});