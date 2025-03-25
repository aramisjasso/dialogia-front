// src/protected/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, requireAuth }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Redirige a "/" si la ruta requiere autenticación y el usuario no está autenticado
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  // Redirige a "/home" si la ruta NO requiere autenticación pero el usuario SÍ está autenticado
  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  // Si no se cumple ninguna de las condiciones anteriores, renderiza el contenido
  return children;
};

export default ProtectedRoute;