import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/hooks/useAuth';

const ProtectedRoute = ({ children, requireAuth }) => {
  const location = useLocation();
  const { currentUser, loading, updateUserField } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  const ALLOWED_PATHS = ['/select-interests', '/registeruser', '/'];

  useEffect(() => {
    const verifyAuth = async () => {
      // Verificación del username en localStorage
      const storedUsername = localStorage.getItem("username");
      if (currentUser && !currentUser.username && storedUsername) {
        await updateUserField({ username: storedUsername });
      }
      setIsReady(true);
    };

    if (!loading) {
      verifyAuth();
    }
  }, [currentUser, loading]);

  if (loading || !isReady) {
    return <div>Cargando...</div>;
  }

  // Lógica de redirección
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

  if (!requireAuth && currentUser && location.pathname === "/") {
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