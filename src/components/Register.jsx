// src/components/Register.jsx
import React, { useState } from "react";
import { Button, Box, Heading, Text, Input, Flex } from "@chakra-ui/react";
import { registerWithGoogle, registerWithEmail } from "../firebase/auth.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { toaster } from "../components/ui/toaster"; // Importa toaster

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Verificar si el nombre de usuario ya existe
  const checkUsernameExists = async (username) => {
    const userDoc = await getDoc(doc(db, "usernames", username));
    return userDoc.exists();
  };

  // Verificar si el correo ya está registrado
  const checkEmailExists = async (email) => {
    const userDoc = await getDoc(doc(db, "emails", email));
    return userDoc.exists();
  };

  // Guardar usuario en Firestore
  const saveUserToFirestore = async (user, username) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
    });
    await setDoc(doc(db, "usernames", username), { uid: user.uid });
    await setDoc(doc(db, "emails", user.email), { uid: user.uid });
  };

  const handleRegisterWithGoogle = async () => {
    if (!username) {
      toaster.create({
        title: "Error",
        description: "Por favor, ingresa un nombre de usuario",
        status: "error", // Si tu implementación de toaster soporta "status"
      });
      return;
    }

    try {
      const user = await registerWithGoogle();
      await saveUserToFirestore(user, username);
      toaster.create({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada con Google",
        status: "success", // Si tu implementación de toaster soporta "status"
      });
      navigate("/login"); // Redirigir al login
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        status: "error", // Si tu implementación de toaster soporta "status"
      });
    }
  };

  const handleRegisterWithEmail = async () => {
    if (!username || !email || !password) {
      toaster.create({
        title: "Error",
        description: "Por favor, completa todos los campos",
        status: "error", // Si tu implementación de toaster soporta "status"
      });
      return;
    }

    try {
      // Verificar si el nombre de usuario ya existe
      if (await checkUsernameExists(username)) {
        toaster.create({
          title: "Error",
          description: "El nombre de usuario ya está en uso",
          status: "error", // Si tu implementación de toaster soporta "status"
        });
        return;
      }

      // Verificar si el correo ya está registrado
      if (await checkEmailExists(email)) {
        toaster.create({
          title: "Error",
          description: "El correo electrónico ya está registrado",
          status: "error", // Si tu implementación de toaster soporta "status"
        });
        return;
      }

      const user = await registerWithEmail(email, password);
      await saveUserToFirestore(user, username);
      toaster.create({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada",
        status: "success", // Si tu implementación de toaster soporta "status"
      });
      navigate("/login"); // Redirigir al login
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        status: "error", // Si tu implementación de toaster soporta "status"
      });
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading textAlign="center">Regístrate</Heading>
      <Text mt={4} textAlign="center">
        Crea una cuenta para continuar
      </Text>
      <Flex direction="column" gap={4} mt={6}>
        <Input
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleRegisterWithEmail}>
          Registrarse con Correo
        </Button>
        <Button colorScheme="blue" onClick={handleRegisterWithGoogle}>
          Registrarse con Google
        </Button>
      </Flex>
    </Box>
  );
};

export default Register;