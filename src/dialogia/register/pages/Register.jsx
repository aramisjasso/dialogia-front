// src/components/Register.jsx
import React, { useState } from "react";
import { Button, Box, Heading, Text, Input, Flex, Link,Field } from "@chakra-ui/react";
import { registerWithGoogle, registerWithEmail } from "../../../firebase/auth.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster"; // Importa toaster

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword,setconfirmpassword] = useState("");
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
    if (await checkUsernameExists(username)) {
      toaster.create({
        title: "Error",
        description: "El nombre de usuario ya está en uso",
        status: "error", // Si tu implementación de toaster soporta "status"
      });
      return;
    }
    if (username.includes('@') || username.includes('/') || username.includes('\\') || username.includes('.')) {
      toaster.create({
        title: "Error",
        description: "El nombre de usuario no puede contener @, /, \\ o .",
        status: "error",
      });
      return;
    }

    try {
      
      const user = await registerWithGoogle();
      await saveUserToFirestore(user, username);
      navigate("/login");
      window.location.reload();
      toaster.create({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada con Google",
        status: "success", // Si tu implementación de toaster soporta "status"
        onCloseComplete: () => navigate("/login")
      });
       // Redirigir al login
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
    if (password!=confirmpassword) {
      toaster.create({
        title: "Error",
        description: "La contraseña no coincide",
        status: "error", // Si tu implementación de toaster soporta "status"
      });
      return;
    }
    if (username.includes('@') || username.includes('/') || username.includes('\\') || username.includes('.')) {
      toaster.create({
        title: "Error",
        description: "El nombre de usuario no puede contener @, /, \\ o .",
        status: "error",
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
      navigate("/login");
      window.location.reload();
      toaster.create({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada",
        status: "success", // Si tu implementación de toaster soporta "status"
      });
      
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
      maxW="500px"
      mx="auto"
      mt={5}
      mb={5}
      p={6}
      borderWidth="1px"
      boxShadow="lg"
      bg="blackAlpha.900" // Fondo negro
      color="white" // Texto blanco en general
    
    >
      <Heading textAlign="left" color="white">
        Regístrate
      </Heading>
      {/*<Text mt={4} textAlign="center">
        Crea una cuenta para continuar
      </Text>*/}

      <Flex direction="column" gap={4} mt={6}>
        <Text color="white">Usuario</Text>
        <Field.Root>
        <Input
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          bg="blackAlpha.800" // Fondo oscuro para los inputs
          color="white" // Texto blanco en los inputs
          borderColor="gray.600" // Borde gris para contraste
        />
        </Field.Root>

        
        <Text color="white">Correo</Text>
        <Field.Root>
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg="blackAlpha.800"
          color="white"
          borderColor="gray.600"
        />
        </Field.Root>

        <Field.Root>

        <Text color="white">Contraseña</Text>
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bg="blackAlpha.800"
          color="white"
          borderColor="gray.600"
        />
        </Field.Root>

        <Text color="white">Confirmar contraseña</Text>
        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmpassword}
          onChange={(e) => setconfirmpassword(e.target.value)}
          bg="blackAlpha.800"
          color="white"
          borderColor="gray.600"
        />

      </Flex>

      {/* Botones en fila y sin redondeo */}
      <Flex direction="row" gap={4} mt={6} justifyContent="center">
        <Button
          colorScheme="teal"
          variant="outline"
          onClick={handleRegisterWithEmail}
          borderRadius="0" // Sin redondeo
          borderColor="white" // Borde blanco para contraste
          color="white" // Texto blanco
        >
          Registrarse con Correo
        </Button>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={handleRegisterWithGoogle}
          borderRadius="0"
          borderColor="white"
          color="white"
        >
          Registrarse con Google
        </Button>
      </Flex>

      {/* Enlace "Ya tengo una cuenta" */}
      <Text mt={6} textAlign="center" color="white">
        ¿Ya tienes una cuenta?{" "}
        <Link color="teal.500" href="/login">
          Inicia sesión
        </Link>
      </Text>
    </Box>
  );
};

export default Register;