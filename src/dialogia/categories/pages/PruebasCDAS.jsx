import React from "react";
import { Button, Box, Heading, VStack } from "@chakra-ui/react";
import CreateDebateDialog from "../components/CreateDebateDialog"; // Ajusta la ruta según tu estructura

const PruebasCDAS = () => {
  return (
    <Box p={8} maxW="800px" mx="auto">
      <Heading mb={8} textAlign="center">
        Pruebas del Componente de Creación de Debates
      </Heading>

      <VStack spacing={6} align="stretch">
        {/* Versión desde el Home (sin categoría pre-seleccionada) */}
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>
            Versión desde el Home
          </Heading>
         
            Esta versión muestra el selector de categorías (todas las disponibles)
          
          <CreateDebateDialog
            triggerButton={
              <Button colorScheme="blue">Abrir diálogo (versión Home)</Button>
            }
          />
        </Box>

        {/* Versión desde una categoría específica */}
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>
            Versión desde Página de Categoría
          </Heading>
          
            Esta versión NO muestra el selector de categorías (ya viene pre-seleccionada)
          
          <CreateDebateDialog
            triggerButton={
              <Button colorScheme="teal">
                Abrir diálogo (versión Categoría específica)
              </Button>
            }
            categoryId="idGaming" // Puedes cambiar este ID por cualquier otro de tus categorías
          />
        </Box>

        {/* Explicación */}
        <Box p={4} borderWidth="1px" borderRadius="lg" bg="blackAlpha.100">
          <Heading size="sm" mb={2}>
            Instrucciones:
          </Heading>
          
            1. Prueba ambos diálogos para ver las diferencias
            <br />
            2. La versión Home muestra todas las categorías como botones
            <br />
            3. La versión Categoría oculta el selector (usa la categoría pasada como prop)
            <br />
            4. Verifica que las validaciones funcionen correctamente
            <br />
            5. Prueba agregar y eliminar referencias
          
        </Box>
      </VStack>
    </Box>
  );
};

export default PruebasCDAS;