// src/components/Login.jsx
import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, Flex,Field, Link  } from "@chakra-ui/react";
import { login, registerWithGoogle } from "../../../firebase/auth";
import { toaster } from "../../../components/ui/toaster"
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
    toaster.create({
      title: "Error",
      description: "Credenciales Incorectas",
      type: "error",
    })
   


  }
};
const handleRegisterWithGoogle = async () => {
    try {
      await registerWithGoogle();
      navigate("/home");

    } catch (error) {

    } 
  };

  
  // Validar si los inputs están vacíos
  const isDisabled = !email.trim() || !password.trim();

  return (
    <Flex
      justifyContent="center" // Centra horizontalmente
      alignItems="center" // Centra verticalmente
      p={8}
    >
      <Box  
        maxWidth="600px"
        maxHeight="600px"
        width="100%"
        height="100%"
        borderWidth="1px" 
        bg="bg" 
        shadow="md" 
        p={8} >

        <Heading  size="3xl">Iniciar Sesión</Heading>

        {/*<Text m={2}>Ingresa tus credenciales</Text>*/}
        <Field.Root>
          <Field.Label textStyle="sm" m={2}>Correo o Usuario</Field.Label>
          <Input
            shadow="md"
            variant="subtle"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // 🔥 Bloquea la tecla espacio
            }}
          />

        </Field.Root>

        <Field.Root>
          <Field.Label textStyle="sm" m={2}>Contraseña</Field.Label>
          <Input
          shadow="md"
          variant="subtle"
          type="password"
          placeholder="Escribe tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />

        </Field.Root>
      
      <Flex
      justifyContent="right" // Centra horizontalmente
      alignItems="center" // Centra verticalmente
      >
        <Link 
          mt={4} 
          color="teal" 
          cursor="pointer" 
          onClick={() => navigate("/recover")}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Flex>
        

      <Flex
      direction="row" 
      gap={4} 
      mt={6} 
      justifyContent="center"
      >
        <Button 
          colorScheme="teal"
          variant="outline"
          p={8}
          onClick={handleLogin}
          disabled = {isDisabled}
          borderRadius="0" // Sin redondeo
          borderColor="black" // Borde blanco para contraste
          borderWidth="1px"
          textStyle="md"
          >
          Iniciar Sesión
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          p={8}
          onClick={handleRegisterWithGoogle}
          borderRadius="0" // Sin redondeo
          borderColor="black" // Borde blanco para contraste
          borderWidth="1px"
          textStyle="md"
        >
        Iniciar Sesión con Google
        </Button>
        </Flex>
    
      <Flex
      justifyContent="center" // Centra horizontalmente
      alignItems="center" // Centra verticalmente
      >
        <Link 
          mt={8} 
          color="teal" 
          onClick={() => navigate("/register")}
          cursor="pointer">
          No tengo una cuenta.
        </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;