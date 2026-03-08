import { useState, useContext } from "react";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser, userToken } = useContext(AuthContext);

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

  const headers = { Authorization: `Bearer ${userToken}` };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/update-profile",
        profileForm,
        { headers }
      );

      const updated = res.data.user;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

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

    if (passForm.newPassword !== passForm.confirmPassword)
      return setPassMsg({ type: "error", text: "New passwords do not match." });

    if (passForm.newPassword.length < 6)
      return setPassMsg({ type: "error", text: "Password must be at least 6 characters." });

    setPassLoading(true);
    setPassMsg(null);

    try {
      await axios.put(
        "http://localhost:5000/api/user/change-password",
        {
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
        },
        { headers }
      );

      setPassMsg({ type: "success", text: "Password changed successfully!" });

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
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  const handlePassChange = (field) => (e) =>
    setPassForm({ ...passForm, [field]: e.target.value });

  const toggle = (key) => () =>
    setShow((s) => ({ ...s, [key]: !s[key] }));

  const PasswordField = ({ label, field, visible, toggleKey }) => (
    <TextField
      fullWidth
      label={label}
      type={visible ? "text" : "password"}
      value={passForm[field]}
      onChange={handlePassChange(field)}
      required
      sx={{ ...inputStyle, mt: 2 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={toggle(toggleKey)} sx={{ color: "rgba(255,255,255,0.4)" }}>
              {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg,#0b0b0b,#1a1a2e)", pt: 0, pb: 6, px: 2 }}>
      <Box sx={{ maxWidth: 680, mx: "auto" }}>

        <Typography variant="h4" fontWeight={700}
          sx={{ background: "linear-gradient(90deg,#ffa500,#ff5e00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 4 }}>
          My Profile
        </Typography>

        {/* Avatar */}
        <Paper sx={card}>
          <Avatar sx={avatar}>{getInitials(user?.name)}</Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color="white">{user?.name || "User"}</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>{user?.email}</Typography>
          </Box>
        </Paper>

        {/* Profile */}
        <Paper sx={section}>
          <Typography variant="h6" color="white" fontWeight={700} mb={2}>Update Information</Typography>

          {profileMsg && <Alert severity={profileMsg.type} icon={profileMsg.type === "success" ? <CheckCircleIcon /> : null}>{profileMsg.text}</Alert>}

          <Box component="form" onSubmit={handleProfileUpdate}>
            <TextField
              fullWidth
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              sx={inputStyle}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              sx={{ ...inputStyle, mt: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
            />

            <Button type="submit" disabled={profileLoading} startIcon={profileLoading ? <CircularProgress size={16} /> : <SaveIcon />} sx={orangeBtn}>
              {profileLoading ? "Saving…" : "Save Changes"}
            </Button>
          </Box>
        </Paper>

        {/* Password */}
        <Paper sx={section}>
          <Typography variant="h6" color="white" fontWeight={700} mb={2}>Change Password</Typography>

          {passMsg && <Alert severity={passMsg.type}>{passMsg.text}</Alert>}

          <Box component="form" onSubmit={handlePasswordChange}>
            <PasswordField label="Current Password" field="currentPassword" visible={show.c} toggleKey="c" />
            <PasswordField label="New Password" field="newPassword" visible={show.n} toggleKey="n" />
            <PasswordField label="Confirm New Password" field="confirmPassword" visible={show.f} toggleKey="f" />

            <Button type="submit" disabled={passLoading} startIcon={passLoading ? <CircularProgress size={16}/> : <LockIcon />} sx={orangeBtn}>
              {passLoading ? "Updating…" : "Update Password"}
            </Button>
          </Box>
        </Paper>

      </Box>
    </Box>
  );
}

/* styles */

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
  background: "linear-gradient(90deg, #ffa500, #ff5e00d5)",
  fontWeight: 700,
  fontSize: "0.95rem",
  textTransform: "none",
  letterSpacing: 0.3,
  "&:hover": {
    background: "linear-gradient(90deg, #ff8c00, #e04e00)",
  },
  "&.Mui-disabled": {
    background: "rgba(255,165,0,0.3)",
    color: "rgba(255,255,255,0.4)",
  },
};
