// src/components/Recover.jsx
import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, Flex, Field, Link } from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase"; // Asegúrate de importar auth desde Firebase
import { useNavigate } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster"; // Importa toaster

const Recover = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRecoverPassword = async () => {
    if (!email.trim()) {
      toaster.create({
        title: "Error",
        description: "Por favor, ingresa tu correo electrónico",
        status: "error",
      });
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        // Solo muestra error si el formato es inválido.
        toaster.create({
          title: "Error",
          description: "El formato del correo electrónico no es válido.",
          status: "error",
        });
        return;
      }
      // Ignora otros errores (como "auth/user-not-found").
    }
  
    // Mensaje genérico para todos los casos.
    toaster.create({
      title: "Éxito",
      description: "Si el correo está registrado, se ha enviado un enlace de recuperación.",
      status: "success",
    });
  
    navigate("/login");
  };

  return (
    <Flex
          justifyContent="center" // Centra horizontalmente
          alignItems="center" // Centra verticalmente
          p={8}
          //minH="80vh"
        >
    <Box  
      maxWidth="600px"
      maxHeight="1200px"
      width="100%"
      height="100%"
      borderWidth="1px" 
      bg="bg" 
      shadow="md" 
      p={8} >

      <Heading  size="3xl" mb={10}>Restablecer contraseña</Heading>
      <Flex direction="column" gap={4} my={10}> 
        <Field.Root>
          <Field.Label textStyle="sm" m={2}>Correo electrónico</Field.Label>
          <Input
            shadow="md"
            variant="subtle"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // 🔥 Bloquea la tecla espacio 
            }} 
          />
        </Field.Root>
        <Flex
              justifyContent="center" // Centra horizontalmente
              alignItems="center" // Centra verticalmente
              >
          <Button 
          colorScheme="teal" 
          variant="outline"
          p={8}
          mt={10}
          onClick={handleRecoverPassword}
          borderRadius="0" // Sin redondeo
          borderColor="black" // Borde blanco para contraste
          borderWidth="1px"
          textStyle="md"
          >
            Enviar correo
          </Button>

        </Flex>
        <Flex
              justifyContent="center" // Centra horizontalmente
              alignItems="center" // Centra verticalmente
              >
          <Link 
              color="teal" 
              onClick={() => navigate("/login")}
              cursor="pointer"
              mb={16}>
              Iniciar sesión
            </Link>
          </Flex>
      </Flex>
    </Box>
    </Flex>
  );
};

export default Recover;