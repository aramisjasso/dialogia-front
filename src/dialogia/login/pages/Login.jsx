// src/components/Login.jsx
import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, Flex, } from "@chakra-ui/react";
import { login  } from "../../../firebase/auth";

import { useNavigate } from "react-router-dom";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
(false); // Para manejar el estado de carga
  const navigate = useNavigate();

  const handleLogin = async () => {

  try {
    // Autentica al usuario con Firebase
    const userCredential = await login(
      email,
      password
    );

    // Si la autenticación es exitosa
    const user = userCredential.user;
    console.log("Usuario autenticado:", user);

    navigate("/home")
  } catch (error) {
    // Si hay un error, muestra un mensaje
    console.error("Error al iniciar sesión:", error);


  }
};

  // Validar si los inputs están vacíos
  const isDisabled = !email.trim() || !password.trim();

  return (
    <Box textAlign="center" mt={10}>
      <Heading>Iniciar Sesión</Heading>
      <Text mt={4}>Ingresa tus credenciales</Text>
      <Input
        mt={4}
        placeholder="Correo electrónico / Usuario"
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
      <Flex justifyContent="center" mt={6} gap={4}>
      <Button 
        mt={4} 
        colorScheme="teal" 
        onClick={handleLogin}
        disabled = {isDisabled}
        >
        Iniciar Sesión
      </Button>
      <Button mt={4} colorScheme="teal" onClick={() => navigate("/register")}>
        Crea una cuenta.
      </Button>
      </Flex>
      <Text 
        mt={4} 
        color="teal" 
        cursor="pointer" 
        onClick={() => navigate("/recover")}
      >
        ¿Olvidaste tu contraseña?
      </Text>
      
    </Box>
  );
};

export default Login;