
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
        
        await saveUserToFirestore(user, username);
        navigate("/home");
        
        toaster.create({
          title: "Registro exitoso",
          description: "Tu usuario ha sido registrado",
          status: "success", // Si tu implementación de toaster soporta "status"
          onCloseComplete: () => navigate("/home")
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