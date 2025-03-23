// src/firebase/auth.js
import { auth, provider } from "./firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

// Registro con Google
export const registerWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error("Error en registro con Google: " + error.message);
  }
};

// Registro con correo y contraseña
export const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw new Error("Error en registro con correo: " + error.message);
  }
};