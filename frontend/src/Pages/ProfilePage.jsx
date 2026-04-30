import { useState, useContext, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Avatar, Alert,
  CircularProgress, Paper, InputAdornment, IconButton
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfilePage() {
  const { user, token, login } = useContext(AuthContext);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({ c: false, n: false, f: false });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const [profileMsg, setProfileMsg] = useState(null);
  const [passMsg, setPassMsg] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  // ✅ FIX #11 — Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (!profileMsg) return;
    const t = setTimeout(() => setProfileMsg(null), 5000);
    return () => clearTimeout(t);
  }, [profileMsg]);

  useEffect(() => {
    if (!passMsg) return;
    const t = setTimeout(() => setPassMsg(null), 5000);
    return () => clearTimeout(t);
  }, [passMsg]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // ✅ FIX #1 — Clear the CORRECT message (profileMsg, not passMsg)
    setProfileMsg(null);
    setProfileLoading(true);

    // ✅ FIX #8 — Trim inputs before validation
    const trimmedName = profileForm.name.trim();
    const trimmedEmail = profileForm.email.trim();

    // ✅ FIX #9 — Minimum name length validation
    if (trimmedName.length < 2) {
      setProfileMsg({ type: "error", text: "Name must be at least 2 characters." });
      setProfileLoading(false);
      return;
    }

    // ✅ FIX #3 — Email format validation
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setProfileMsg({ type: "error", text: "Please enter a valid email address." });
      setProfileLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `${BASE}/api/user/update-profile`,
        { name: trimmedName, email: trimmedEmail },
        { headers }
      );

      // ✅ FIX #5 — Guard against missing res.data.user before calling login
      if (res.data?.user) {
        login(token, res.data.user);
      }

      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.message || "Update failed.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // ✅ Correct — clears profileMsg (not passMsg) when switching sections
    setProfileMsg(null);

    if (passForm.newPassword !== passForm.confirmPassword)
      return setPassMsg({ type: "error", text: "Passwords do not match." });

    if (passForm.newPassword.length < 6)
      return setPassMsg({ type: "error", text: "Min 6 characters required." });

    setPassLoading(true);
    setPassMsg(null);

    try {
      await axios.put(
        `${BASE}/api/user/change-password`,
        {
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
        },
        { headers }
      );

      setPassMsg({ type: "success", text: "Password updated!" });

      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPassMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setPassLoading(false);
    }
  };
  const getInitials = (name) =>
    name?.trim()
      ? name
          .trim()
          .split(" ")
          .filter(Boolean)
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  const handlePassChange = (field) => (e) =>
    setPassForm({ ...passForm, [field]: e.target.value });

  const toggle = (key) => () =>
    setShow((s) => ({ ...s, [key]: !s[key] }));

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0b0b0b,#1a1a2e)",
      pt: "90px",
      pb: 6,
      px: 2
    }}>
      <Box sx={{ maxWidth: 680, mx: "auto" }}>

        <Typography variant="h4" fontWeight={700} sx={{
          background: "linear-gradient(90deg,#ffa500,#ff5e00)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4
        }}>
          My Profile
        </Typography>

        {/* Avatar Card */}
        <Paper sx={card}>
          <Avatar sx={avatar}>{getInitials(user?.name)}</Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color="white">
              {user?.name || "User"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
              {user?.email}
            </Typography>
          </Box>
        </Paper>

        {/* Profile Update Section */}
        <Paper sx={section}>
          <Typography variant="h6" color="white" fontWeight={700} mb={2}>
            Update Information
          </Typography>

          {profileMsg && (
            <Alert severity={profileMsg.type} sx={{ mb: 2 }}>
              {profileMsg.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleProfileUpdate}>
            <TextField
              fullWidth
              label="Full Name"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
              sx={{ ...inputStyle, mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              disabled={profileLoading}
              startIcon={
                profileLoading ? <CircularProgress size={16} /> : <SaveIcon />
              }
              sx={orangeBtn}
            >
              {profileLoading ? "Saving…" : "Save Changes"}
            </Button>
          </Box>
        </Paper>

        {/* Password Change Section */}
        <Paper sx={section}>
          <Typography variant="h6" color="white" fontWeight={700} mb={2}>
            Change Password
          </Typography>

          {passMsg && (
            <Alert severity={passMsg.type} sx={{ mb: 2 }}>
              {passMsg.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handlePasswordChange}>
          
            <PasswordField
              label="Current Password"
              value={passForm.currentPassword}
              onChange={handlePassChange("currentPassword")}
              visible={show.c}
              onToggle={toggle("c")}
              autoComplete="current-password"
            />
            <PasswordField
              label="New Password"
              value={passForm.newPassword}
              onChange={handlePassChange("newPassword")}
              visible={show.n}
              onToggle={toggle("n")}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm Password"
              value={passForm.confirmPassword}
              onChange={handlePassChange("confirmPassword")}
              visible={show.f}
              onToggle={toggle("f")}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              disabled={passLoading}
              startIcon={
                passLoading ? <CircularProgress size={16} /> : <LockIcon />
              }
              sx={orangeBtn}
            >
              {passLoading ? "Updating…" : "Update Password"}
            </Button>
          </Box>
        </Paper>

      </Box>
    </Box>
  );
}
function PasswordField({ label, value, onChange, visible, onToggle, autoComplete }) {
  return (
    <TextField
      fullWidth
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      required
      sx={{ ...inputStyle, mt: 2 }}
      inputProps={{ autoComplete }} 
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
           
            <IconButton onClick={onToggle} edge="end">
            
              {visible
                ? <VisibilityOffIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                : <VisibilityIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
              }
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const card = {
  display: "flex",
  gap: 3,
  p: 3,
  mb: 3,
  alignItems: "center",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,165,0,0.15)",
  borderRadius: 3,
};

const section = {
  p: 3,
  mb: 3,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,165,0,0.15)",
  borderRadius: 3,
};

const avatar = {
  width: 80,
  height: 80,
  bgcolor: "#ffa500",
  color: "#000",
  fontWeight: 800,
  fontSize: "1.8rem",
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(255,165,0,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#ffa500" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.45)" },
};

const orangeBtn = {
  mt: 3,
  width: "100%",
  py: 1.3,
  borderRadius: 2,
  background: "linear-gradient(90deg,#ffa500,#ff5e00)",
  fontWeight: 700,
  textTransform: "none",
  color: "#000",
  "&:hover": {
    background: "linear-gradient(90deg,#ff8c00,#e04e00)",
  },
};
