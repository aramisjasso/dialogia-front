import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Flex,
  Box,
  Input,
  Text,
  Button,
  HStack,
  CloseButton,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";

const MAX_REFERENCES = 5;
const REFERENCE_MAX_LENGTH = 200;

export default function CommentForm({ isVisible, onCancel, isInFavor }) {
  // Se extrae el ID del debate desde la URL con useParams.
  const { id } = useParams();

  const [argument, setArgument] = useState("");
  const [newRef, setNewRef] = useState("");
  const [refs, setRefs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUsername = () => localStorage.getItem("username") || "usuario-ejemplo";

  if (!isVisible) return null;

  const bgColor = isInFavor ? "white" : "gray.800";
  const textColor = isInFavor ? "black" : "white";

  // Manejador para actualizar el comentario
  const handleArgumentChange = (e) => {
    setArgument(e.target.value);
  };

  // Manejador para actualizar el input de la nueva referencia
  const handleNewRefChange = (e) => {
    if (e.target.value.length <= REFERENCE_MAX_LENGTH) {
      setNewRef(e.target.value);
    }
  };

  // Agrega una referencia al arreglo si cumple los límites
  const handleAddRef = () => {
    const trimmed = newRef.trim();
    if (!trimmed) return;
    if (refs.length >= MAX_REFERENCES) {
      toaster.create({
        title: "Límite alcanzado",
        description: `Solo puedes agregar hasta ${MAX_REFERENCES} referencias`,
        status: "warning",
      });
      return;
    }
    if (trimmed.length > REFERENCE_MAX_LENGTH) {
      toaster.create({
        title: "Referencia muy larga",
        description: `Las referencias no pueden exceder ${REFERENCE_MAX_LENGTH} caracteres`,
        status: "warning",
      });
      return;
    }
    setRefs([...refs, trimmed]);
    setNewRef("");
  };

  // Quita una referencia del arreglo
  const handleRemoveRef = (index) => {
    setRefs(refs.filter((_, i) => i !== index));
  };

  // Publica el comentario utilizando la ruta correcta: /[id]/comments
  const handlePublish = async () => {
    if (!argument.trim()) {
      toaster.create({
        title: "El comentario no puede estar vacío",
        status: "error",
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    const payload = {
      username: getUsername(),
      argument,
      refs
    };

    console.debug("DEBUG: Payload a enviar al API:", payload);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/debates/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Error al publicar el comentario");

      console.log("Comentario publicado:", payload);
      toaster.create({
        title: "Comentario publicado",
        status: "success",
        duration: 2000,
      });
      // Limpiar los campos
      setArgument("");
      setRefs([]);
      onCancel();
    } catch (error) {
      console.error(
        "Error al publicar el comentario:",
        error.response?.status,
        error.response?.data || error.message
      );
      toaster.create({
        title: `Error al publicar (${error.response?.status || ""})`,
        description: error.response?.data?.error || error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      bg="rgba(0,0,0,0.4)"
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
    >
      <Box
        bg={bgColor}
        color={textColor}
        p={6}
        borderRadius="md"
        maxW="600px"
        width="90%"
        shadow="lg"
      >
        <Text fontSize="2xl" mb={4}>
          Deja un comentario
        </Text>

        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="bold">Tu comentario</Text>
            <Input
              placeholder="Escribe tu argumento..."
              value={argument}
              onChange={handleArgumentChange}
            />
          </Box>

          <Box>
            <Text fontWeight="bold">
              Referencias (máx. {MAX_REFERENCES})
            </Text>
            <HStack spacing={2}>
              <Input
                placeholder={`Agregar referencia (máx. ${REFERENCE_MAX_LENGTH} caracteres)`}
                value={newRef}
                onChange={handleNewRefChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddRef();
                }}
              />
              <Button onClick={handleAddRef}>Agregar</Button>
            </HStack>
            {refs.length > 0 && (
              <Box mt={2} borderWidth="1px" p={2} borderRadius="md">
                {refs.map((r, idx) => (
                  <Flex key={idx} justify="space-between" align="center" py={1}>
                    <Text isTruncated maxW="80%">
                      {r}
                    </Text>
                    <CloseButton size="sm" onClick={() => handleRemoveRef(idx)} />
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        </VStack>

        <Flex justifyContent="flex-end" gap={3} mt={4}>
          <Button onClick={onCancel} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handlePublish} isLoading={isLoading}>
            Publicar
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
