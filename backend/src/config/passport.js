import dotenv from 'dotenv';
dotenv.config(); // ← NUCLEAR FIX — load env vars inside passport itself

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from '../models/User.js';

// ─── Serialize / Deserialize ───────────────────────────────
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ─── Google Strategy ───────────────────────────────────────
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        await user.save();
      } else {
        user = await User.create({
          googleId: profile.id,
          name:     profile.displayName,
          email:    profile.emails[0].value,
          avatar:   profile.photos[0].value
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// ─── Facebook Strategy ─────────────────────────────────────

export default passport;