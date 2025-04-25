import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, requireAuth }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(true);
  const location = useLocation();

  // Rutas permitidas sin intereses seleccionados
  const ALLOWED_PATHS = ['/select-interests', '/registeruser', '/'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const idusuario = currentUser.uid;
          
          // Verificar en Firestore si el usuario existe
          const userDocRef = doc(db, "users", idusuario);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Si no existe en Firestore, redirigir a registeruser
            if (location.pathname !== "/registeruser") {
              window.location.href = "/registeruser";
              return;
            }
          } else {
            // Si existe, obtener datos de la API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${idusuario}`);
            
            if (!response.ok) {
              throw new Error("Error al obtener datos del usuario");
            }

            const data = await response.json();
            setUserData(data);
            localStorage.setItem("username", data.username);

            // Redirigir a /home si ya tiene username y está en /registeruser
            if (data.username && location.pathname === "/registeruser") {
              return <Navigate to="/home" replace />;
            }
          }
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
  }, [location.pathname]);

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

  // Si el usuario no tiene username y no está en /registeruser
  if (user && (!userData?.username || userData.username === '') && location.pathname !== "/registeruser") {
    return <Navigate to="/registeruser" replace />;
  }

  // Si ya tiene username y está en /registeruser, redirigir a home
  if (user && userData?.username && location.pathname === "/registeruser") {
    return <Navigate to="/home" replace />;
  }

  // Verificación de intereses (solo si tiene username)
  if (user && userData?.username) {
    // Si no tiene intereses y no está en una ruta permitida
    if ((!userData.interests || userData.interests.length === 0) && 
        !ALLOWED_PATHS.includes(location.pathname)) {
      return <Navigate to="/select-interests" replace />;
    }
    
    // Si está en select-interests pero ya tiene intereses, redirigir a home
    if (location.pathname === "/select-interests" && 
        userData.interests && 
        userData.interests.length > 0) {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;