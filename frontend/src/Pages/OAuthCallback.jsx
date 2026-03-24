import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function OAuthCallback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);          // ✅ Stores JWT in localStorage + context
      navigate("/");         // ✅ Redirect home after login
    } else {
      navigate("/");         // ✅ Fallback if token missing
    }
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      color: "white" 
    }}>
      Logging you in...
    </div>
  );
}