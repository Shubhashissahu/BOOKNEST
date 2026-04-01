//frontend/pages/Oauthcallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Use context, not a prop

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get login from context

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Auth failed");
        return res.json();
      })
      .then(({ user }) => {
        login(token, user); // ✅ Single call — saves to localStorage + state
        navigate("/");
      })
      .catch(() => navigate("/"));
  }, []);

  return <p>Logging you in...</p>;
}