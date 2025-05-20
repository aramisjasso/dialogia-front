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
  Image,
  Link,
  Avatar,
} from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import ImageUploader from "../categories/components/ImageUploader";


const MAX_REFERENCES = 5;
const REFERENCE_MAX_LENGTH = 200;


export default function ReplyCommentForm({
  isVisible,
  onCancel,
  isInFavor,
  onNewComment,
  parentComment, // Comentario al que se está respondiendo
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


  if (!isVisible || !parentComment) return null;


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
    let finalImage = image;


    if (uploaderRef.current?.hasFile) {
      try {
        const fileData = await uploaderRef.current.uploadFile();
        finalImage = fileData.url;
        setImage(finalImage);
      } catch (error) {
        console.error("Error al subir:", error);
      }
    }


    const payload = {
      paidComment: parentComment.idComment,
      username: getUsername(),
      argument,
      position: isInFavor,
      refs,
      image: finalImage,
    };


    console.debug("DEBUG: Payload para respuesta:", payload);


    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/debates/${id}/comments/reply`,
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


        if (errorData?.error.includes("viola nuestras normas")) {
          throw new Error(errorData.reason || errorData.error);
        } else {
          throw new Error("Error al publicar la respuesta");
        }
      }


      const newReply = await response.json();


      toaster.create({
        title: "Respuesta publicada",
        status: "success",
        duration: 2000,
      });


      // Limpia el formulario
      setArgument("");
      setRefs([]);
      onCancel();


      // Notifica al padre para actualizar contadores
      onNewComment(newReply);
    } catch (error) {
      toaster.create({
        title: `Error al responder`,
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
          Responder comentario
        </Text>


        {/* Mostrar el comentario padre completo */}
        <Box
          bg="gray.100"
          p={4}
          borderRadius="md"
          mb={4}
          borderLeft="4px solid"
          borderColor={parentComment.position ? "blue.500" : "red.500"}
        >
          <Flex align="flex-start" flexWrap="wrap">
            <Avatar.Root
              style={{ borderRadius: "9999px", overflow: "hidden" }}
              mr={4}
              size="lg"
            >
              <Avatar.Fallback
                delayms={600}
              >{`A${parentComment.user?.id}`}</Avatar.Fallback>
              <Avatar.Image
                src={`/avatar_${parentComment.user?.avatarId || "1"}.jpg`}
                alt={`Avatar ${parentComment.user?.id}`}
                objectFit="cover"
              />
            </Avatar.Root>


            <Box flex="1" minW="200px">
              <Flex align="center" flexWrap="wrap">
                <Text fontWeight="bold" mr={2} fontSize="sm">
                  {parentComment.username}
                </Text>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">
                  {new Date(parentComment.datareg).toLocaleDateString("es-ES")}{" "}
                  {new Date(parentComment.datareg)
                    .toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toLowerCase()}
                </Text>
              </Flex>
              <Text mt={1} color="gray.700" fontSize="sm">
                {parentComment.argument}
              </Text>
              {parentComment.image && (
                <Image src={parentComment.image} mt={2} maxH="150px" />
              )}
              {parentComment.refs && parentComment.refs.length > 0 && (
                <Box mt={2}>
                  <Text fontSize="xs" fontWeight="semibold">
                    Referencias:
                  </Text>
                  <VStack align="start" spacing={1} mt={1}>
                    {parentComment.refs.map((r, i) => (
                      <Link
                        key={i}
                        href={r}
                        fontSize="xs"
                        isExternal
                        _hover={{
                          textDecoration: "underline",
                          color: "blue.500",
                        }}
                      >
                        • {r}
                      </Link>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>


        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="bold">Tu respuesta</Text>
            <Input
              placeholder="Escribe tu respuesta..."
              value={argument}
              onChange={handleArgumentChange}
            />
          </Box>


          {/* Imagen */}
          <Box fontWeight={"bold"}>
            Imagen (opcional)
            <ImageUploader ref={uploaderRef} folderPath="debate" />
          </Box>


          <Box>
            <Text fontWeight="bold">Referencias (máx. {MAX_REFERENCES})</Text>
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
            Publicar respuesta
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}


