// src/components/RecoverReset.jsx
import React, { useState, useEffect } from "react";
import { Box, Heading, Input, Button, Text, Flex, Spinner } from "@chakra-ui/react";
import { confirmPasswordReset, verifyPasswordResetCode, getAuth } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";

const RecoverReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Para mostrar un spinner mientras se verifica el código
  const [isCodeValid, setIsCodeValid] = useState(false); // Para saber si el código es válido
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode"); // Obtener el código de Firebase
  const navigate = useNavigate();
  const auth = getAuth();

  // Verificar si el código es válido al cargar la página
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        toaster.create({
          title: "Error",
          description: "Código de restablecimiento no válido",
          status: "error",
        });
        navigate("/login"); // Redirigir al login si no hay código
        return;
      }

      try {
        await verifyPasswordResetCode(auth, oobCode);
        setIsCodeValid(true); // El código es válido
      } catch (error) {
        toaster.create({
          title: "Error",
          description: "El enlace de restablecimiento no es válido o ha expirado",
          status: "error",
        });
        navigate("/login"); // Redirigir al login si el código no es válido
      } finally {
        setIsLoading(false); // Detener el spinner
      }
    };

    verifyCode();
  }, [oobCode, auth, navigate]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Por favor, completa ambos campos",
        status: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Las contraseñas no coinciden",
        status: "error",
      });
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toaster.create({
        title: "Éxito",
        description: "Tu contraseña ha sido restablecida",
        status: "success",
      });
      navigate("/login"); // Redirigir al login
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  // Mostrar un spinner mientras se verifica el código
  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Verificando enlace de restablecimiento...</Text>
      </Box>
    );
  }

  // Mostrar el formulario solo si el código es válido
  if (!isCodeValid) {
    return null; // No mostrar nada si el código no es válido (ya se redirigió)
  }

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
      <Heading textAlign="center">Restablecer Contraseña</Heading>
      <Text mt={4} textAlign="center">
        Ingresa tu nueva contraseña
      </Text>
      <Flex direction="column" gap={4} mt={6}>
        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleResetPassword}>
          Restablecer Contraseña
        </Button>
      </Flex>
    </Box>
  );
};

export default RecoverReset;