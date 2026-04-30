import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import { saveAuth, getStoredUser, clearAuth, getToken } from "../utils/auth";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => getStoredUser());
  const [token, setToken]     = useState(() => getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    let cancelled = false; // ✅ Prevent state update if unmounted

    fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token invalid");
        return res.json();
      })
      .then(({ user }) => {
        if (cancelled) return; // ✅ Guard against stale updates
        saveAuth(storedToken, user);
        setUser(user);
        setToken(storedToken);
      })
      .catch(() => {
        if (cancelled) return;
        clearAuth();
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; }; // ✅ Cleanup on unmount

  }, []); // ✅ Empty array — runs ONCE on mount only

  // ✅ useCallback — stable function references, won't trigger child useEffects
  const login = useCallback((newToken, newUser) => {
    saveAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  if (loading) return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#0b0b0b"
    }}>
      <CircularProgress sx={{ color: "#ffa500" }} />
    </Box>
  );

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}