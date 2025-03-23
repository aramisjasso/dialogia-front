import React from "react";
import { Box, Heading, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Para navegar entre pantallas

const Root = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Heading>Bienvenido a Dialogia</Heading>
      Elige una opción para continuar
      <Flex justifyContent="center" mt={6} gap={4}>
        <Button colorScheme="teal" onClick={() => navigate("/login")}>
          Iniciar Sesión
        </Button>
        <Button colorScheme="blue" onClick={() => navigate("/register")}>
          Registrarse
        </Button>
      </Flex>
    </Box>
  );
};


export default Root;