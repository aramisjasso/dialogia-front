// src/protected/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, requireAuth, checkInterests = false }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Obtener el nombre de usuario (asumiendo que está en displayName)
          const idusuario = currentUser.uid;
          console.log(idusuario);
          console.log(currentUser);
          if (!idusuario) {
            throw new Error("Nombre de usuario no definido");
          }

          // Hacer la llamada a la API
          const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${idusuario}`);
          
          if (!response.ok) {
            throw new Error("Error al obtener datos del usuario");
          }

          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        } finally {
          setApiLoading(false);
        }
      } else {
        setApiLoading(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || (user && apiLoading)) {
    return <div>Cargando...</div>;
  }

  // Redirige si la ruta requiere autenticación y no hay usuario
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  // Redirige si la ruta NO requiere autenticación pero hay usuario
  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  // Si la ruta requiere verificación de intereses y el usuario no los tiene
  if (checkInterests && userData && (!userData.interests || userData.interests.length === 0)) {
    return <Navigate to="/select-interests" replace />;
  }

  // Si no, renderiza el contenido
  return children;
};

export default ProtectedRoute;