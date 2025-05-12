import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/hooks/useAuth';

const ProtectedRoute = ({ children, requireAuth }) => {
  const location = useLocation();
  const { currentUser, loading, updateUserField } = useAuth();
  const [lastPath, setLastPath] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  const ALLOWED_PATHS = ['/select-interests', '/registeruser', '/'];

  // Efecto para manejar cambios de ruta sin ciclos
  useEffect(() => {
    if (location.pathname !== lastPath) {
      setIsChecking(true);
      setLastPath(location.pathname);
      console.log("location pathname: ",location.pathname);
      console.log("last Path: ", lastPath);
      // Verificación rápida del username en localStorage
      const storedUsername = localStorage.getItem("username");
      console.log("Stored username: ", storedUsername);
      if (currentUser && !currentUser.username && storedUsername) {
        updateUserField({ username: storedUsername });
      }
      console.log("hola");
      setIsChecking(false);
      console.log("is Checking: ", isChecking);
    }
  }, [location.pathname, currentUser]);

  if (isChecking) {
    return <div>Cargando...</div>;
  }

  // Lógica de redirección optimizada
  const shouldRedirectToRegister = 
    currentUser && 
    (!currentUser.username || currentUser.username === '') && 
    location.pathname !== "/registeruser";

  const shouldRedirectToHome = 
    currentUser?.username && 
    location.pathname === "/registeruser";

  const shouldRedirectToInterests = 
    currentUser?.username && 
    (!currentUser.interests || currentUser.interests.length === 0) && 
    !ALLOWED_PATHS.includes(location.pathname);

  if (requireAuth && !currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && currentUser) {
    return <Navigate to="/home" replace />;
  }

  if (shouldRedirectToRegister) {
    return <Navigate to="/registeruser" replace />;
  }

  if (shouldRedirectToHome) {
    return <Navigate to="/home" replace />;
  }

  if (shouldRedirectToInterests) {
    return <Navigate to="/select-interests" replace />;
  }

  if (location.pathname === "/select-interests" && currentUser?.interests?.length > 0) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;