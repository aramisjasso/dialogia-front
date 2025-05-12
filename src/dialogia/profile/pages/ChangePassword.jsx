// src/components/ChangePassword.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Flex,
  Button,
  Link,
} from "@chakra-ui/react";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster";
import { useNavigate } from 'react-router-dom';

const PASSWORD_MAX_LENGTH = 32;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
    const handleLogout = async () => {
        try {
        await signOut(auth);
        navigate('/recover');
        } catch (error) {
        console.error(error);
        }
    };
  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    toaster.create({
      title: "Error",
      description: "Por favor, completa todos los campos",
      status: "error",
    });
    return;
  }

  if (newPassword.length > PASSWORD_MAX_LENGTH) {
    toaster.create({
      title: "Error",
      description: `La nueva contraseña no puede tener más de ${PASSWORD_MAX_LENGTH} caracteres`,
      status: "error",
    });
    return;
  }

  const missingRequirements = [];

  if (!/[A-Z]/.test(newPassword)) {
    missingRequirements.push("una letra mayúscula (A-Z)");
  }

  if (!/[0-9]/.test(newPassword)) {
    missingRequirements.push("un número (0-9)");
  }

  if (!/[^A-Za-z0-9]/.test(newPassword)) {
    missingRequirements.push("un carácter especial (ej: !@#$%)");
  }

  if (missingRequirements.length > 0) {
    toaster.create({
      title: "Error",
      description: `La contraseña debe contener ${missingRequirements.join(", ")}`,
      status: "error",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    toaster.create({
      title: "Error",
      description: "Las nuevas contraseñas no coinciden",
      status: "error",
    });
    return;
  }

  const user = auth.currentUser;

  if (!user || !user.email) {
    toaster.create({
      title: "Error",
      description: "Usuario no autenticado",
      status: "error",
    });
    return;
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  try {
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    toaster.create({
      title: "Contraseña actualizada",
      description: "Tu contraseña se ha cambiado correctamente",
      status: "success",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      toaster.create({
        title: "Error",
        description: "La contraseña actual es incorrecta",
        status: "error",
      });
    } else {
      toaster.create({
        title: "Error",
        description: "Hubo un error al cambiar la contraseña",
        status: "error",
      });
    }
  }
};

  const handlePasswordInput = (setter) => (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= PASSWORD_MAX_LENGTH) setter(value);
  };

  return (
    <Box maxW="500px" mx="auto" mt={5} mb={5} p={6} borderWidth="1px" boxShadow="lg" bg="blackAlpha.900" color="white">
      <Heading textAlign="left">Cambiar Contraseña</Heading>

      <Flex direction="column" gap={4} mt={6}>
        <Text>Contraseña actual</Text>
        <Input
          type="password"
          value={currentPassword}
          onChange={handlePasswordInput(setCurrentPassword)}
          bg="blackAlpha.800"
          color="white"
          borderColor="gray.600"
        />

        <Text>Nueva contraseña</Text>
        <Input
          type="password"
          value={newPassword}
          onChange={handlePasswordInput(setNewPassword)}
          bg="blackAlpha.800"
          color="white"
          borderColor="gray.600"
        />

        <Text>Confirmar nueva contraseña</Text>
        <Input
          type="password"
          value={confirmPassword}
          onChange={handlePasswordInput(setConfirmPassword)}
          bg="blackAlpha.800"
          color="white"
          borderColor="gray.600"
        />
      </Flex>

      <Button mt={6} colorScheme="teal" variant="outline" borderColor="white" color="white" onClick={handleChangePassword}>
        Cambiar contraseña
      </Button>

      <Text mt={4} fontSize="sm" color="gray.400" textAlign="center">
        ¿Olvidaste tu contraseña?{" "}
        <Link color="teal.300" onClick={handleLogout} textDecoration="underline">
          Recupérala aquí
        </Link>
      </Text>
    </Box>
  );
};

export default ChangePassword;
