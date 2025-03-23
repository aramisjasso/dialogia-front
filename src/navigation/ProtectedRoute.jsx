// src/protected/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children, requireAuth }) => {
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;