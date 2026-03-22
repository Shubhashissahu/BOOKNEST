import express from "express";
import passport from "passport"; // ✅ Change require() to import!
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// ─── Existing JWT Auth ─────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);

// ─── Google OAuth ──────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + '/dashboard');
  }
);

// ─── Get Current User ──────────────────────────────────────
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
});

// ─── Logout ────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect(process.env.CLIENT_URL);
  });
});

// ─── Failure Route ─────────────────────────────────────────
router.get('/failed', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

export default router;