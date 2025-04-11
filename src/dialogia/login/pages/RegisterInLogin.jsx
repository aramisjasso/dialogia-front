
import React, { useState, useEffect } from "react";
import { Button, Box, Heading, Text, Input, Flex, Link,Field } from "@chakra-ui/react";
// import { registerWithGoogle, registerWithEmail } from "../../../firebase/auth.js";

import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster"; // Importa toaster

const RegisterInLogin= ()=>{
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const USERNAME_MAX_LENGTH = 20; // Máximo 20 caracteres

    const blockInvalidChars = (e) => {
      // Bloquea caracteres prohibidos: espacio, @, /, \, .
      if ([' ', '@', '/', '\\', '.'].includes(e.key)) {
        e.preventDefault();
      }
      // Bloquea si ya se alcanzó el límite y no es una tecla de control (como Backspace)
      if (username.length >= USERNAME_MAX_LENGTH && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
      }
    };

    const handleUsernameChange = (e) => {
      const inputValue = e.target.value;
      // Filtra caracteres no permitidos y trunca si es necesario
      const filteredValue = inputValue
        .replace(/[@\/\\ .]/g, '') // Elimina @, /, \, ., y espacios
        .slice(0, USERNAME_MAX_LENGTH); // Corta a 20 caracteres
      setUsername(filteredValue);
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
      return () => unsubscribe();
    }, []);
    
    const checkUsernameExists = async (username) => {
        const userDoc = await getDoc(doc(db, "usernames", username));
        return userDoc.exists();
      };
    
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
          type: "error",
        });
        return;
      }
      if (await checkUsernameExists(username)) {
        toaster.create({
          title: "Error",
          description: "El nombre de usuario ya está en uso",
          status: "error", // Si tu implementación de toaster soporta "status"
          type: "error",
        });
        return;
      }
      if (username.includes('@') || username.includes('/') || username.includes('\\') || username.includes('.')) {
        toaster.create({
          title: "Error",
          description: "El nombre de usuario no puede contener @, /, \\ o .",
          status: "error",
          type: "error",
        });
        return;
      }
  
      try {
        
        await saveUserToFirestore(user, username).then();
        navigate("/select-interests");
        toaster.create({
          title: "Registro exitoso",
          description: "Tu usuario ha sido registrado",
          status: "success", // Si tu implementación de toaster soporta "status" 
        });
        // Redirigimos inmediatamente después de guardar
        
         // Redirigir al login
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
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="white">Usuario</Text>
            <Text color="gray.400" fontSize="sm">
              {username.length}/{USERNAME_MAX_LENGTH}
            </Text>
          </Flex>
            <Field.Root>
            <Input
              placeholder="Nombre de usuario"
              value={username}
              onChange={handleUsernameChange}
              onKeyDown={blockInvalidChars} // <- Bloquea al teclear
              bg="blackAlpha.800" // Fondo oscuro para los inputs
              color="white" // Texto blanco en los inputs
              borderColor="gray.600" // Borde gris para contraste
            />
            </Field.Root>
    
    
          </Flex>
    
          {/* Botones en fila y sin redondeo */}
          <Flex direction="row" gap={4} mt={6} justifyContent="center">
            
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={handleRegisterWithGoogle}
              borderRadius="0"
              borderColor="white"
              color="white"
            >
              Registrar tu usuario
            </Button>
          </Flex>
    
        </Box>
  );
};

export default RegisterInLogin;