//backend/routes/auth.js
import express from "express";
import passport from "passport"; 
import { registerUser, loginUser } from "../controllers/authController.js";
import jwt from "jsonwebtoken"; 
import { protect } from "../middleware/auth.js";
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
    const token = jwt.sign(
      { 
        id: req.user._id,
        name: req.user.name,
        email: req.user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // ✅ Send token to frontend via query param
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
  }
);

// ─── Get Current User ──────────────────────────────────────
router.get('/me', protect, (req, res) => {
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