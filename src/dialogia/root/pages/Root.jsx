import React from "react";
import { Box, Heading, Button, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Para navegar entre pantallas

const Root = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={1}>
      <Image
              src="LOGO_ORIGINAL.png" // Reemplaza con tu ilustración
              alt="Dialogia"
              boxSize="400px"
              mx="auto"
              objectFit="contain" // Asegura que toda la imagen sea visible
              mb={0}
            />
      {/* <Heading>Bienvenido a Dialogia</Heading>
      Elige una opción para continuar */}
      <Flex justifyContent="center" mt={6} gap={4}>
        <Button 
        variant="outline"
        borderRadius="0" // Sin redondeo
        borderColor="black" // Borde blanco para contraste
        colorScheme="teal" 
        onClick={() => navigate("/login")}>
          Iniciar Sesión
        </Button>
        <Button 
        borderRadius="0" // Sin redondeo
        borderColor="black" // Borde blanco para contraste
        colorScheme="blue" 
        onClick={() => navigate("/register")}>
          Registrarse
        </Button>
      </Flex>
    </Box>
  );
};


export default Root;