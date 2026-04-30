//backend/routes/auth.js
import express  from "express";
import passport from "passport";
import jwt      from "jsonwebtoken";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ── JWT Auth ────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login",    loginUser);

// ── Google OAuth ────────────────────────────────────────────
router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: true,  // ✅ FIX #4 — CSRF protection
  })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/failed" }),
  (req, res) => {
    // ✅ FIX #3 — consistent JWT payload (id only)
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d", issuer: "booknest-api" }
    );

    // ✅ FIX #1 — use fragment (#) not query (?) to keep token out of logs
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback#token=${token}`);
  }
);

// ── Get Current User ────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  // ✅ FIX #2 — strip password before sending
  const { password, ...safeUser } = req.user.toObject
    ? req.user.toObject()
    : req.user;
  res.json({ user: safeUser });
});

// ✅ FIX #5 — POST logout, stateless JWT acknowledgment
router.post("/logout", protect, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// ── Failure Route ───────────────────────────────────────────
router.get("/failed", (req, res) => {
  res.status(401).json({ error: "Authentication failed" });
});

export default router;