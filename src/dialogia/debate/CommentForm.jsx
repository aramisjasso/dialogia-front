import React, { useState, useRef } from "react";
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
import ImageUploader from "../categories/components/ImageUploader";


const MAX_REFERENCES = 5;
const REFERENCE_MAX_LENGTH = 200;


export default function CommentForm({
  isVisible,
  onCancel,
  isInFavor,
  onNewComment,      // callback del padre
}) {
  const { id } = useParams();
  const [argument, setArgument] = useState("");
  const [newRef, setNewRef] = useState("");
  const [refs, setRefs] = useState([]);
  const [image, setImage] = useState("");  
  const uploaderRef = useRef();
  const [isLoading, setIsLoading] = useState(false);


  const getUsername = () => {
    return localStorage.getItem("username") || "usuario-ejemplo";
  };


  if (!isVisible) return null;


  const bgColor = isInFavor ? "white" : "gray.800";
  const textColor = isInFavor ? "black" : "white";


  const handleArgumentChange = (e) => {
    setArgument(e.target.value);
  };


  const handleNewRefChange = (e) => {
    if (e.target.value.length <= REFERENCE_MAX_LENGTH) {
      setNewRef(e.target.value);
    }
  };


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


  const handleRemoveRef = (index) => {
    setRefs(refs.filter((_, i) => i !== index));
  };


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
    let finalImage = image; // Valor por defecto (puede ser '')
   
    if (uploaderRef.current?.hasFile) {
      try {
        const fileData = await uploaderRef.current.uploadFile();
        finalImage = fileData.url; // Usamos una variable, no el estado
        setImage(finalImage); // Actualizamos el estado (pero no lo esperamos)
      } catch (error) {
        console.error('Error al subir:', error);
      }
    }




    // Incluir 'position' según isInFavor
    const payload = {
      username: getUsername(),
      argument,
      position: isInFavor,
      refs,
      image: finalImage, // Aquí sí tendrá el valor correcto
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
      if (!response.ok) {
        // Intentamos parsear el error como JSON para ver si es el caso específico
        const errorData = await response.json().catch(() => null);
       
        if (errorData?.error.includes("viola nuestras normas") ) {
          throw new Error(errorData.reason || errorData.error);
        } else {
          throw new Error("Error al publicar el comentario");
        }
      }


      const newComment = await response.json(); // comentario creado


      toaster.create({
        title: "Comentario publicado",
        status: "success",
        duration: 2000,
      });


      // Limpia el formulario
      setArgument("");
      setRefs([]);
      onCancel();


      // Notifica al padre para actualizar contadores
      onNewComment(newComment);


    } catch (error) {
     
      toaster.create({
        title: `Error al publicar`,
        description: error.message,
        status: "error",
        duration: 3000,
        type: "error",
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
        <Text fontSize="2xl" mb={4} fontWeight="bold">
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
          {/* Imagen */}
          <Box fontWeight={"bold"}>
            Imagen (opcional)
            <ImageUploader ref={uploaderRef} folderPath="debate"/>
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
                  <Flex
                    key={idx}
                    justify="space-between"
                    align="center"
                    py={1}
                  >
                    <Text isTruncated maxW="80%">
                      {r}
                    </Text>
                    <CloseButton
                      size="sm"
                      onClick={() => handleRemoveRef(idx)}
                    />
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
          <Button
            colorScheme="blue"
            onClick={handlePublish}
            isLoading={isLoading}
          >
            Publicar
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}