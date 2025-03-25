import { useRouteError } from "react-router-dom";
import { Box, Heading, Text, Button, Flex, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
 const Error = () => {
  const error = useRouteError();

  return (
    <Box textAlign="center" py={2} px={2}>
      <Image
        src="LOGO_ORIGINAL.png" // Reemplaza con tu ilustración
        alt="Error 404"
        boxSize="300px"
        mx="auto"
        objectFit="contain" // Asegura que toda la imagen sea visible
        mb={1}
      />
      <Heading as="h1" size="xl" mb={4}>
        ¡Vaya! Este debate no existe... o aún no.
      </Heading>
      <Text fontSize="lg" mb={8}>
        Parece que el enlace que seguiste es incorrecto. 
        Pero no te preocupes, aquí hay otras formas de participar:
      </Text>
      <Flex justify="center" gap={4} flexWrap="wrap">
        <Button 
          as={RouterLink}
          to="/home" 
          colorScheme="blue" 
          size="lg"
          borderRadius="0" // Sin redondeo
          borderColor="black" // Borde blanco para contraste
        >
          Ir al Inicio
        </Button>
        <Button 
          as={RouterLink}
          to="/categories" 
          variant="outline" 
          size="lg"
          borderRadius="0" // Sin redondeo
          borderColor="black" // Borde blanco para contraste
        >
          Explorar categorias populares
        </Button>
       
      </Flex>
      <Text mt={10} fontStyle="italic" color="gray.500">
        "En el diálogo, incluso los errores nos llevan a nuevas ideas."
      </Text>
    </Box>
  );
}
export default Error;