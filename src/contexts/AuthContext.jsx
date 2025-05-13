import { createContext, useEffect, useState, useCallback, useRef } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pendingRefresh = useRef(false);

  // Función para actualizar campos específicos sin recargar todo
  const updateUserField = useCallback((fieldUpdates) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return { ...prev, ...fieldUpdates };
    });
    
    // Actualizar localStorage si corresponde
    if ('username' in fieldUpdates) {
      localStorage.setItem("username", fieldUpdates.username || '');
    }
    if ('censorship' in fieldUpdates) {
      localStorage.setItem("censorship", fieldUpdates.censorship ?? true);
    }
  }, []);

  // Refresh completo solo cuando es realmente necesario
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Solo refrescar si no tenemos datos o si el usuario cambió
        if (!currentUser || user.uid !== currentUser.uid) {
          refreshUser();
        }
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, [currentUser?.uid]); // Solo dependemos del UID

  const value = {
    currentUser,
    loading,
    error,
    refreshUser,
    updateUserField // Nueva función para actualizaciones parciales
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};