// src/protected/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, requireAuth }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Ya terminó de verificar
      // console.log(user)
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  // Redirige si la ruta requiere autenticación y no hay usuario
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  // Redirige si la ruta NO requiere autenticación pero hay usuario
  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  // Si no, renderiza el contenido
  return children;
};

export default ProtectedRoute;