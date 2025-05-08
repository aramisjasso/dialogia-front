// contexts/AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones en componentes desmontados
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Obtenemos datos básicos de autenticación
          const basicUserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || ''
          };

          // Intentamos obtener datos adicionales de Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              if (isMounted) {
                setCurrentUser({
                  ...basicUserData,
                  ...userDoc.data()
                });
              }
            } else {
              if (isMounted) setCurrentUser(basicUserData);
            }
          } catch (firestoreError) {
            console.error("Error fetching user data:", firestoreError);
            if (isMounted) setCurrentUser(basicUserData);
          }
        } else {
          if (isMounted) setCurrentUser(null);
        }
      } catch (authError) {
        console.error("Authentication error:", authError);
        if (isMounted) setError(authError.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    // Función para actualizar manualmente si es necesario
    refreshUser: async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        setCurrentUser({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || '',
          photoURL: auth.currentUser.photoURL || '',
          ...userDoc.data()
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};