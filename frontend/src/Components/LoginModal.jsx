import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { loginUser, registerUser } from "../api/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginModal({ show, onClose }) {
  const { login } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await loginUser({ email, password });
         login(res.data.token);
        alert("Login Successful");
        resetFields();
        onClose();
      } else {
        await registerUser({ name, email, password });

        alert("Registration Successful");
        resetFields();
        setIsLogin(true);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong";
      alert(message);
    }
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    resetFields();
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.15)",
          p: 1,
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
          px: 2,
          py: 1,
          background: "linear-gradient(90deg,#ffa500,#ff5e00)",
          borderRadius: "15px 15px 0 0",
        }}
      >
        {isLogin ? "Login" : "Register"}

        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* BODY */}
      <DialogContent sx={{ mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Full Name (Register Only) */}
          {!isLogin && (
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
          )}

          {/* Email */}
          <TextField
            fullWidth
            type="email"
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />

          {/* Password */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: "30px",
              background: "linear-gradient(90deg,#ffa500,#ff5e00)",
              fontWeight: "bold",
              "&:hover": {
                opacity: 0.9,
                transform: "translateY(-2px)",
                transition: "0.2s",
              },
            }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </Box>

        {/* SWITCH LOGIN / REGISTER */}
        <Typography
          align="center"
          sx={{ mt: 2, color: "rgba(255,255,255,0.7)" }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={handleSwitch}
            style={{
              color: "#ffa500",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isLogin ? "Register here" : "Login here"}
          </span>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}