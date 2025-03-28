// src/firebase/auth.js
// import { em } from "framer-motion/m";
import { auth, provider, db } from "./firebase";
import {  collection, query, where, getDocs } from "firebase/firestore";
import { signInWithPopup, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification} from "firebase/auth";

// Registro con Google
export const registerWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    
    await sendEmailVerification(result.user);
    
    return result.user;

  } catch (error) {
    throw new Error("Error en registro con Google: " + error.message);
  }
};

// Registro con correo y contraseña
export const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result.user;
  
  } catch (error) {
    throw new Error("Error en registro con correo: " + error.message);
  }
};

// Login con correo/usuario y contraseña
export const login = async (emailOrUsername, password) => {
  try {
    let email = emailOrUsername;
    if (!emailOrUsername.includes("@")){
      email = await getEmailByUsername(emailOrUsername); // Busca el correo por username
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    throw new Error("Error en login con correo: " + error.message);
  }
};

// Función para obtener el correo electrónico por username
export const getEmailByUsername = async (username) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el usuario, devuelve su correo electrónico
      const userDoc = querySnapshot.docs[0].data();
      return userDoc.email;
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    await sendEmailVerification(result.user);
    
    return result.user;

  } catch (error) {
    throw new Error("Error en registro con Google: " + error.message);
  }
};
// Registro con correo y contraseña
export const loginOut = async () => {
  auth.signOut()
};