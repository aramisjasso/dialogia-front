// src/components/Login.jsx
import React, { useState } from "react";
import { Box, Heading, Input, Button, Text } from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Lógica de inicio de sesión (la implementaremos más adelante)
    console.log("Iniciar sesión con:", email, password);
  };

  return (
    <Box textAlign="center" mt={10}>
      <Heading>Iniciar Sesión</Heading>
      <Text mt={4}>Ingresa tus credenciales</Text>
      <Input
        mt={4}
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        mt={4}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button mt={4} colorScheme="teal" onClick={handleLogin}>
        Iniciar Sesión
      </Button>
    </Box>
  );
};

export default Login;