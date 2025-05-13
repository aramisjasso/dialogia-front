import React, { useState } from "react";
import { Box, Heading, Input, Button, Flex, Field, Link, useBreakpointValue } from "@chakra-ui/react";
import { login, loginWithGoogle } from "../../../firebase/auth";
import { toaster } from "../../../components/ui/toaster";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Valores responsivos ajustados
  const boxMaxWidth = useBreakpointValue({ base: "95%", sm: "400px", md: "450px", lg: "500px" });
  const boxPadding = useBreakpointValue({ base: 4, md: 6 });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const buttonPadding = useBreakpointValue({ base: 4, md: 6 });
  const buttonLayout = useBreakpointValue({ base: "column", md: "row" });

  const handleLogin = async () => {
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;
      console.log("Usuario autenticado:", user);

      await fetch(`${import.meta.env.VITE_API_URL}/user/${user.uid}/badges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      navigate("/home");
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Credenciales Incorrectas",
        type: "error",
      });
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/home");
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error",
        description: "Error al iniciar sesión con Google",
        type: "error",
      });
    }
  };

  const isDisabled = !email.trim() || !password.trim();

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      p={4}
      minH="100vh"
      w="100%"
    >
      <Box  
        maxWidth={boxMaxWidth}
        width="100%"
        borderWidth="1px" 
        bg="bg" 
        shadow="md" 
        p={boxPadding}
      >
        <Heading size={headingSize} mb={4}>Iniciar Sesión</Heading>

        <Field.Root mb={3}>
          <Field.Label textStyle="sm" mb={1}>Correo o Usuario</Field.Label>
          <Input
            shadow="md"
            variant="subtle"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
            }}
          />
        </Field.Root>

        <Field.Root mb={3}>
          <Field.Label textStyle="sm" mb={1}>Contraseña</Field.Label>
          <Input
            shadow="md"
            variant="subtle"
            type="password"
            placeholder="Escribe tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field.Root>
      
        <Flex justifyContent="flex-end" mb={4}>
          <Link 
            color="teal" 
            cursor="pointer" 
            onClick={() => navigate("/recover")}
            fontSize="sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Flex>
        
        <Flex
          direction={buttonLayout}
          gap={3} 
          mb={4}
          justifyContent="center"
        >
          <Button 
            colorScheme="teal"
            variant="outline"
            p={buttonPadding}
            onClick={handleLogin}
            disabled={isDisabled}
            borderRadius="0"
            borderColor="black"
            borderWidth="1px"
            textStyle="md"
            width={{ base: "100%", md: "auto" }}
            flex="1"
          >
            Iniciar Sesión
          </Button>
          <Button
            colorScheme="teal"
            variant="outline"
            p={buttonPadding}
            onClick={handleRegisterWithGoogle}
            borderRadius="0"
            borderColor="black"
            borderWidth="1px"
            textStyle="md"
            width={{ base: "100%", md: "auto" }}
            flex="1"
          >
            Iniciar con Google
          </Button>
        </Flex>
    
        <Flex justifyContent="center">
          <Link 
            color="teal" 
            onClick={() => navigate("/register")}
            cursor="pointer"
            fontSize="sm"
          >
            No tengo una cuenta.
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;