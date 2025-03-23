// src/components/Recover.jsx
import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, Flex } from "@chakra-ui/react";
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
      toaster.create({
        title: "Éxito",
        description: "Se ha enviado un enlace de recuperación a tu correo electrónico",
        status: "success",
      });
      navigate("/login"); // Redirigir al login después de enviar el correo
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        status: "error",
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
      <Heading textAlign="center">Recuperar Contraseña</Heading>
      <Text mt={4} textAlign="center">
        Ingresa tu correo electrónico para recibir un enlace de recuperación
      </Text>
      <Flex direction="column" gap={4} mt={6}>
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleRecoverPassword}>
          Enviar Enlace
        </Button>
        <Button variant="link" onClick={() => navigate("/login")}>
          Volver al Inicio de Sesión
        </Button>
      </Flex>
    </Box>
  );
};

export default Recover;