import { createContext, useEffect, useState, useCallback, useRef } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pendingRefresh = useRef(false);
  const unsubscribeRef = useRef(null);

  const updateUserField = useCallback((fieldUpdates) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return { ...prev, ...fieldUpdates };
    });
    
    if ('username' in fieldUpdates) {
      localStorage.setItem("username", fieldUpdates.username || '');
    }
    if ('censorship' in fieldUpdates) {
      localStorage.setItem("censorship", fieldUpdates.censorship ?? true);
    }
  }, []);

  const refreshUser = useCallback(async (force = false) => {
    if (pendingRefresh.current && !force) return;
    pendingRefresh.current = true;

    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        setCurrentUser(null);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        username: '',
        interests: [],
        ...(userDoc.exists() ? userDoc.data() : {})
      };

      setCurrentUser(userData);
      localStorage.setItem("username", userData.username || '');
      localStorage.setItem("censorship", userData.censorship ?? true);
    } catch (err) {
      console.error("Error refreshing user:", err);
      setError("Error al cargar datos del usuario");
    } finally {
      setLoading(false);
      pendingRefresh.current = false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      // Limpiar el estado
      setCurrentUser(null);
      setError(null);
      // Limpiar localStorage
      localStorage.removeItem("username");
      localStorage.removeItem("censorship");
      
      // Desuscribir el listener de autenticación si existe
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError("Error al cerrar sesión");
    }
  }, []);

  useEffect(() => {
    // Guardar la función de desuscripción en la ref
    unsubscribeRef.current = auth.onAuthStateChanged((user) => {
      if (user) {
        if (!currentUser || user.uid !== currentUser.uid) {
          refreshUser();
        }
      } else {
        setCurrentUser(null);
      }
    });

    // Función de limpieza
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [currentUser?.uid]);

  const value = {
    currentUser,
    loading,
    error,
    refreshUser,
    updateUserField,
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};