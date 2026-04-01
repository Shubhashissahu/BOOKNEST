// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { saveAuth, getStoredUser, clearAuth, getToken } from "../utils/auth";

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

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token invalid");
        return res.json();
      })
      .then(({ user }) => {
        saveAuth(storedToken, user);
        setUser(user);
        setToken(storedToken);   // ✅ Sync token state on mount
      })
      .catch(() => {
        clearAuth();
        setUser(null);
        setToken(null);          // ✅ Clear token state on failure
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, user) => {
    saveAuth(token, user);
    setToken(token);             // ✅ Token state updated
    setUser(user);
  };

  const logout = () => {
    clearAuth();
    setToken(null);              // ✅ Token state cleared
    setUser(null);
  };

  if (loading) return null;

  return (
    // ✅ token now exposed — fixes NavBar's userToken → use token instead
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}