import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Prevents flicker on refresh

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // ✅ Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUserToken(token);
          setUser(decoded);
        } else {
          // ✅ Token expired — clean it up automatically
          localStorage.removeItem("token");
        }

      } catch (err) {
        // ✅ Corrupt/tampered token — wipe it
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // ✅ Done checking
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      setUserToken(token);
      setUser(decoded); // ✅ User data now available everywhere
    } catch (err) {
      console.error("Invalid token received:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
    setUser(null); // ✅ Full clean slate
  };

  // ✅ Don't render children until auth state is resolved
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ userToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}