import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/hooks/useAuth';
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, requireAuth = false }) => {
  const location = useLocation();
  const { currentUser, loading, updateUserField } = useAuth();
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const ONBOARDING_PATHS = ['/select-interests', '/registeruser'];

  // Escuchar el estado de Firebase Auth directamente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setFirebaseReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!firebaseReady) return;

    if (auth?.currentUser || requireAuth) {
      const verifyAuth = async () => {
        const storedUsername = localStorage.getItem("username");
        if (currentUser && !currentUser.username && storedUsername) {
          await updateUserField({ username: storedUsername });
        }
        setIsReady(true);
      };

      if (!loading) {
        verifyAuth();
      }
    } else {
      setIsReady(true);
    }
  }, [firebaseReady, currentUser, loading, requireAuth]);

  // Esperar a que Firebase inicialice
  if (!firebaseReady) {
    return <div>Cargando...</div>;
  }

  // Esperar a que se verifique todo lo demás
  if ((loading || !isReady) && auth?.currentUser) {
    return <div>Cargando...</div>;
  }

  // --- Reglas de navegación ---

  if (!requireAuth && !auth?.currentUser) {
    return children;
  }

  if (!requireAuth && auth?.currentUser) {
    return <Navigate to="/home" replace />;
  }

  if (requireAuth && !auth?.currentUser) {
    return <Navigate to="/" replace />;
  }

  const shouldRedirectToRegister = 
    currentUser && 
    !currentUser.username && 
    !ONBOARDING_PATHS.includes(location.pathname);

  const shouldRedirectToInterests = 
    currentUser?.username && 
    !currentUser.interests?.length && 
    !ONBOARDING_PATHS.includes(location.pathname);

  if (shouldRedirectToRegister) {
    return <Navigate to="/registeruser" replace />;
  }

  if (shouldRedirectToInterests) {
    return <Navigate to="/select-interests" replace />;
  }

  if (ONBOARDING_PATHS.includes(location.pathname) && 
      currentUser?.username && 
      currentUser?.interests?.length) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
