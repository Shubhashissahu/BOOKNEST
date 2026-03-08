import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const { userToken } = useContext(AuthContext);

  if (!userToken) {
    alert("login first");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;