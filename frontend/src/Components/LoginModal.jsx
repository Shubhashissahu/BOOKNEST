import React, { useState, useContext } from "react"; 
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Button, Typography, IconButton, Box, Divider,
} from "@mui/material";

import GoogleLogo from "../assets/g-logo.png";
import CloseIcon from "@mui/icons-material/Close";
import { loginUser, registerUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset":               { borderColor: "rgba(255,255,255,0.25)" },
    "&:hover fieldset":          { borderColor: "rgba(255,165,0,0.5)"   },
    "&.Mui-focused fieldset":    { borderColor: "#ffa500"               },
  },
  "& .MuiInputLabel-root":       { color: "rgba(255,255,255,0.6)"       },
  "& .MuiInputLabel-root.Mui-focused": { color: "#ffa500"              },
};

export default function LoginModal({ show, onClose }) {
  const { login } = useContext(AuthContext);

  const [isLogin,  setIsLogin]  = useState(true);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  // ✅ FIX #4 & #5 — Clear both messages on mode switch
  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setSuccess("");
    resetFields();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ FIX #3 — Client-side validation before hitting the API
    if (!email.trim() || !password.trim())
      return setError("Email and password are required.");

    if (!EMAIL_REGEX.test(email.trim()))
      return setError("Please enter a valid email address.");

    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    if (!isLogin && name.trim().length < 2)
      return setError("Name must be at least 2 characters.");

    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser({ email: email.trim(), password });

        // ✅ FIX #10 — Guard against malformed server response
        if (!res.data?.token || !res.data?.user)
          throw new Error("Invalid server response. Please try again.");

        login(res.data.token, res.data.user);
        resetFields();
        onClose();
      } else {
        await registerUser({ name: name.trim(), email: email.trim(), password });

        // ✅ FIX #1 — setIsLogin(true) called only ONCE
        setSuccess("Account created! Please log in.");
        setIsLogin(true);
        resetFields();
      }
      // ✅ FIX #2 — No redundant setError("") here
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/google`;
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(15,15,25,0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.12)",
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          color: "white",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 1.8,
          background: "linear-gradient(90deg,#ffa500,#ff5e00)",
          borderRadius: 0,
        }}
      >
        {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* BODY */}
      <DialogContent sx={{ px: 3, pt: 3, pb: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>

          {/* Full Name — Register only */}
          {!isLogin && (
            <TextField
              fullWidth
              required
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              inputProps={{ autoComplete: "name" }}
              sx={inputSx}
            />
          )}

          {/* Email */}
          <TextField
            fullWidth
            required
            type="email"
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ autoComplete: "email" }}
            sx={inputSx}
          />

          {/* Password */}
          <TextField
            fullWidth
            required
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // ✅ FIX #7 — Correct autoComplete per context
            inputProps={{
              autoComplete: isLogin ? "current-password" : "new-password",
            }}
            sx={inputSx}
          />

          {/* Error Message */}
          {error && (
            <Typography sx={{ color: "#ff5e00", fontSize: "0.85rem", mt: 1.5 }}>
              ⚠️ {error}
            </Typography>
          )}

          {/* Success Message */}
          {success && (
            <Typography sx={{ color: "#4caf50", fontSize: "0.85rem", mt: 1.5 }}>
              {success}
            </Typography>
          )}

          {/*  FIX #11 — Submit first, then Google (correct UX order) */}
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            fullWidth
            sx={{
              mt: 2.5,
              py: 1.4,
              borderRadius: "30px",
              background: "linear-gradient(90deg,#ffa500,#ff5e00)",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 4px 20px rgba(255,165,0,0.3)",
              "&:hover": {
                opacity: 0.9,
                transform: "translateY(-2px)",
                transition: "0.2s",
                boxShadow: "0 6px 24px rgba(255,165,0,0.4)",
              },
              "&:disabled": { opacity: 0.6 },
            }}
          >
            {loading ? "Please wait…" : isLogin ? "Login" : "Register"}
          </Button>

          {/* Divider */}
          <Box sx={{ display: "flex", alignItems: "center", my: 2.5, gap: 1.5 }}>
            <Divider sx={{ flex: 1, borderColor: "rgba(255,255,255,0.15)" }} />
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
              or
            </Typography>
            <Divider sx={{ flex: 1, borderColor: "rgba(255,255,255,0.15)" }} />
          </Box>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            disabled={loading}
            onClick={handleGoogle}
            startIcon={
  <img src={GoogleLogo} alt="Google" width={20} height={20} style={{ objectFit: "contain" }} />
}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "white",
              borderRadius: "30px",
              py: 1.2,
              borderColor: "#dadce0",
              color: "#3c4043",
              "&:hover": {
                backgroundColor: "#f7f8f8",
                borderColor: "#c6c6c6",
              },
              "&:disabled": { opacity: 0.6 },
            }}
          >
            Continue with Google
          </Button>
        </Box>

        {/* Switch Login / Register */}
        <Typography align="center" sx={{ mt: 2.5, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Box
            component="span"
            onClick={handleSwitch}
            sx={{
              color: "#ffa500",
              cursor: "pointer",
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {isLogin ? "Register here" : "Login here"}
          </Box>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
