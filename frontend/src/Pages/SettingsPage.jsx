import React, { useState, useContext } from "react";
import {
  Box, Container, Typography, Paper, Switch, Button,
  TextField, Avatar, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid,
  MenuItem, Select, FormControl, InputLabel, Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import CancelIcon from "@mui/icons-material/Cancel";

import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

/* ================= COMMON STYLES ================= */

const cardStyle = {
  background: "linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))",
  border: "1px solid rgba(255,165,0,0.15)",
  borderRadius: "16px",
  p: 3
};

const btnPrimary = {
  background: "linear-gradient(135deg, #f59e0b, #ea580c)",
  color: "white",
  fontWeight: "bold",
  borderRadius: "10px",
  py: 1.2,
  "&:hover": {
    background: "linear-gradient(135deg, #ea580c, #d97706)"
  }
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.03)",
    color: "white",
    "& fieldset": { borderColor: "rgba(255,165,0,0.2)" },
    "&:hover fieldset": { borderColor: "#f59e0b" },
    "&.Mui-focused fieldset": { borderColor: "#f59e0b" }
  }
};

/* ================= REUSABLE ================= */

const Section = ({ title, children }) => (
  <Paper sx={cardStyle}>
    {title && (
      <>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
      </>
    )}
    {children}
  </Paper>
);

const ActionButton = ({ children, onClick }) => (
  <Button fullWidth sx={btnPrimary} onClick={onClick}>
    {children}
  </Button>
);

const SwitchRow = ({ label, value, onChange }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      py: 2,
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}
  >
    <Typography color="white">{label}</Typography>
    <Switch checked={value} onChange={onChange} />
  </Box>
);

const format = (k) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

/* ================= MAIN ================= */

export default function SettingsPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("account");
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  const [account, setAccount] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91 98765 43210",
    location: "Mumbai, India"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newBookArrivals: true,
    priceDrops: true
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    dataCollection: true
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    currency: "INR"
  });

  const showMsg = (t) => toast.success(t);

  return (
    <Box sx={{ background: "#020617", minHeight: "100vh", pt: 2, pb: 2 }}>
      <Container maxWidth="md">

        <Typography variant="h4" mb={3} color="white">
          ⚙️ Settings
        </Typography>

        {/* Tabs */}
        <Box display="flex" gap={2} mb={3}>
          {["account", "notifications", "privacy", "preferences"].map((t) => (
            <Button key={t} onClick={() => setTab(t)}>
              {t}
            </Button>
          ))}
        </Box>

        {/* ACCOUNT */}
        {tab === "account" && (
          <Box display="flex" flexDirection="column" gap={4}>

            <Section title="Profile">
              <Box display="flex" justifyContent="space-between">
                <Avatar>{user?.name?.[0]}</Avatar>
                <IconButton onClick={() => setEdit(!edit)}>
                  {edit ? <CancelIcon /> : <EditIcon />}
                </IconButton>
              </Box>

              <Grid container spacing={2} mt={1}>
                {Object.keys(account).map((f) => (
                  <Grid item xs={6} key={f}>
                    <TextField
                      fullWidth
                      label={format(f)}
                      value={account[f]}
                      disabled={!edit || f === "email"}
                      onChange={(e) =>
                        setAccount({ ...account, [f]: e.target.value })
                      }
                      sx={inputStyle}
                    />
                  </Grid>
                ))}
              </Grid>

              {edit && (
                <ActionButton
                  onClick={() => {
                    setEdit(false);
                    showMsg("Profile updated!");
                  }}
                >
                  Save
                </ActionButton>
              )}
            </Section>

            <ActionButton onClick={() => setPwdOpen(true)}>
              Change Password
            </ActionButton>

            <Button color="error" onClick={() => setDel(true)}>
              Delete Account
            </Button>

          </Box>
        )}

        {/* NOTIFICATIONS */}
        {tab === "notifications" && (
          <Section title="Notifications">
            {Object.entries(notifications).map(([k, v]) => (
              <SwitchRow
                key={k}
                label={format(k)}
                value={v}
                onChange={(e) =>
                  setNotifications({ ...notifications, [k]: e.target.checked })
                }
              />
            ))}
            <ActionButton onClick={() => showMsg("Saved!")}>
              Save
            </ActionButton>
          </Section>
        )}

        {/* PRIVACY */}
        {tab === "privacy" && (
          <Section title="Privacy">
            {Object.entries(privacy).map(([k, v]) => (
              <SwitchRow
                key={k}
                label={format(k)}
                value={v}
                onChange={(e) =>
                  setPrivacy({ ...privacy, [k]: e.target.checked })
                }
              />
            ))}
            <ActionButton onClick={() => showMsg("Saved!")}>
              Save
            </ActionButton>
          </Section>
        )}

        {/* PREFERENCES */}
        {tab === "preferences" && (
          <Section title="Preferences">
            <Grid container spacing={2}>
              {Object.entries(preferences).map(([k, v]) => (
                <Grid item xs={6} key={k}>
                  <FormControl fullWidth>
                    <InputLabel>{format(k)}</InputLabel>
                    <Select
                      value={v}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          [k]: e.target.value
                        })
                      }
                    >
                      {["dark", "light", "INR", "USD"].map((x) => (
                        <MenuItem key={x} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>

            <ActionButton onClick={() => showMsg("Saved!")}>
              Save
            </ActionButton>
          </Section>
        )}

        {/* LOGOUT */}
        <Button
          fullWidth
          sx={{ mt: 3 }}
          onClick={logout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>

      </Container>

      {/* PASSWORD */}
      <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {["currentPassword", "newPassword"].map((f) => (
            <TextField key={f} fullWidth label={format(f)} margin="dense" />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwdOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setPwdOpen(false);
              showMsg("Password updated!");
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}
      <Dialog open={del} onClose={() => setDel(false)}>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDel(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              toast.warning("Account deleted");
              logout();
              navigate("/");
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}