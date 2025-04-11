import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Spinner,
  VStack,
  Image,
  Heading
} from '@chakra-ui/react';
import { FaReply, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { toaster } from "../../components/ui/toaster";

export default function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para guardar el voto individual: { [idComment]: { liked: boolean, disliked: boolean } }
  const [likesState, setLikesState] = useState({});
  
  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}`
        );
        if (!response.ok) throw new Error('Error al obtener debate');
        const data = await response.json();
        setComments(data.comments || []);
        // Inicializa el estado de votos para cada comentario
        const initialStates = {};
        (data.comments || []).forEach(c => {
          initialStates[c.idComment] = { liked: false, disliked: false };
        });
        setLikesState(initialStates);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, [id]);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  const inFavor = comments.filter(c => c.position);
  const against = comments.filter(c => !c.position);

  // Handler para gestionar Like
  const handleLike = async (idComment) => {
    try {
      // Si el comentario ya está marcado como like, se quita el like
      if (likesState[idComment]?.liked) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'like', method: 'remove' })
          }
        );
        if (!response.ok) throw new Error('Error al remover like');
        const updatedComment = await response.json();
        setComments(prevComments =>
          prevComments.map(c =>
            c.idComment === idComment ? { ...c, likes: updatedComment.likes } : c
          )
        );
        // Actualiza el estado para remover like
        setLikesState(prev => ({
          ...prev,
          [idComment]: { liked: false, disliked: prev[idComment]?.disliked }
        }));
        toaster.create({
          title: "Like removido",
          status: "success",
          duration: 2000,
        });
      } else {
        // Si anteriormente estaba marcado como dislike, se quita ese voto primero
        if (likesState[idComment]?.disliked) {
          await fetch(
            `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action: 'dislike', method: 'remove' })
            }
          );
        }
        // Se agrega el like
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'like', method: 'add' })
          }
        );
        if (!response.ok) throw new Error('Error al agregar like');
        const updatedComment = await response.json();
        setComments(prevComments =>
          prevComments.map(c =>
            c.idComment === idComment ? { ...c, likes: updatedComment.likes } : c
          )
        );
        // Actualiza el estado para marcar como like y desmarcar dislike
        setLikesState(prev => ({
          ...prev,
          [idComment]: { liked: true, disliked: false }
        }));
        toaster.create({
          title: "Like agregado",
          status: "success",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error al actualizar like",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  // Handler para gestionar Dislike
  const handleDislike = async (idComment) => {
    try {
      // Si ya está marcado como dislike, se remueve el dislike
      if (likesState[idComment]?.disliked) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'dislike', method: 'remove' })
          }
        );
        if (!response.ok) throw new Error('Error al remover dislike');
        const updatedComment = await response.json();
        setComments(prevComments =>
          prevComments.map(c =>
            c.idComment === idComment ? { ...c, dislikes: updatedComment.dislikes } : c
          )
        );
        setLikesState(prev => ({
          ...prev,
          [idComment]: { disliked: false, liked: prev[idComment]?.liked }
        }));
        toaster.create({
          title: "Dislike removido",
          status: "success",
          duration: 2000,
        });
      } else {
        // Si el comentario estaba marcado como like, se quita primero ese voto
        if (likesState[idComment]?.liked) {
          await fetch(
            `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action: 'like', method: 'remove' })
            }
          );
        }
        // Se agrega el dislike
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'dislike', method: 'add' })
          }
        );
        if (!response.ok) throw new Error('Error al agregar dislike');
        const updatedComment = await response.json();
        setComments(prevComments =>
          prevComments.map(c =>
            c.idComment === idComment ? { ...c, dislikes: updatedComment.dislikes } : c
          )
        );
        setLikesState(prev => ({
          ...prev,
          [idComment]: { disliked: true, liked: false }
        }));
        toaster.create({
          title: "Dislike agregado",
          status: "success",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error al actualizar dislike",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Comentarios del Debate</Heading>
      <Flex>
        {/* Columna Izquierda: Comentarios a favor */}
        <Box flex={1} pr={4}>
          <Flex align="center">
            <Heading size="md" mb={2}>Comentarios a favor</Heading>
            <Text ml={4} fontWeight="bold" color="gray.600">Ordenar</Text>
          </Flex>
          <VStack spacing={4} align="stretch">
            {inFavor.map((c) => (
              <Box key={c.idComment} bg="gray.100" p={4} borderRadius="lg" m={2}>
                <Flex align="center" flexWrap="wrap">
                  <Image
                    src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    maxH="60px"
                    maxW="60px"
                    objectFit="cover"
                    mr={3}
                    mb={[2, 0]}
                  />
                  <Box flex="1" minW="200px">
                    <Flex align="center" flexWrap="wrap">
                      <Text fontWeight="bold" mr={2} fontSize={["sm", "md", "lg"]}>
                        {c.username}
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontWeight="bold">
                        {new Date(c.datareg).toLocaleDateString('es-ES')}{" "}
                        {new Date(c.datareg).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }).toLowerCase()}
                      </Text>
                      <Flex ml={6} mr={6} color="gray.500">
                        <Box _hover={{ color: "gray.800", cursor: "pointer" }}>
                          <FaReply />
                        </Box>
                        <Text ml={2} fontWeight="bold">Responder</Text>
                      </Flex>
                    </Flex>
                    <Text mt={1} color="gray.700" fontSize={["sm", "md", "lg"]}>
                      {c.argument}
                    </Text>
                    {c.refs && c.refs.length > 0 && (
                      <Box mt={2}>
                        <Text fontSize="sm" fontWeight="semibold">Referencias:</Text>
                        <VStack align="start" spacing={1} mt={1}>
                          {c.refs.map((r, i) => (
                            <Text key={i} fontSize="sm">• {r}</Text>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                  <Flex align="center" mr={6}>
                    <Box
                      mr={4}
                      mb={8}
                      color={likesState[c.idComment]?.disliked ? "red.500" : "gray.500"}
                      _hover={{ color: likesState[c.idComment]?.disliked ? "red.600" : "gray.700", cursor: "pointer" }}
                      onClick={() => handleDislike(c.idComment)}
                    >
                      <FaThumbsDown />
                    </Box>
                    <Box
                      mr={6}
                      mb={10}
                      color={likesState[c.idComment]?.liked ? "blue.500" : "gray.500"}
                      _hover={{ color: likesState[c.idComment]?.liked ? "blue.600" : "gray.700", cursor: "pointer" }}
                      onClick={() => handleLike(c.idComment)}
                    >
                      <FaThumbsUp />
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Columna Derecha: Comentarios en contra */}
        <Box flex={1} pr={4}>
          <Flex align="center">
            <Heading size="md" mb={2}>Comentarios en contra</Heading>
            <Text ml={4} fontWeight="bold" color="gray.600">Ordenar</Text>
          </Flex>
          <VStack spacing={4} align="stretch">
            {against.map((c) => (
              <Box key={c.idComment} bg="gray.100" p={4} borderRadius="lg" m={2}>
                <Flex align="center" flexWrap="wrap">
                  <Image
                    src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    maxH="60px"
                    maxW="60px"
                    objectFit="cover"
                    mr={3}
                    mb={[2, 0]}
                  />
                  <Box flex="1" minW="200px">
                    <Flex align="center" flexWrap="wrap">
                      <Text fontWeight="bold" mr={2} fontSize={["sm", "md", "lg"]}>
                        {c.username}
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontWeight="bold">
                        {new Date(c.datareg).toLocaleDateString('es-ES')}{" "}
                        {new Date(c.datareg).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }).toLowerCase()}
                      </Text>
                      <Flex ml={6} mr={6} color="gray.500">
                        <Box _hover={{ color: "gray.800", cursor: "pointer" }}>
                          <FaReply />
                        </Box>
                        <Text ml={2} fontWeight="bold">Responder</Text>
                      </Flex>
                    </Flex>
                    <Text mt={1} color="gray.700" fontSize={["sm", "md", "lg"]}>
                      {c.argument}
                    </Text>
                    {c.refs && c.refs.length > 0 && (
                      <Box mt={2}>
                        <Text fontSize="sm" fontWeight="semibold">Referencias:</Text>
                        <VStack align="start" spacing={1} mt={1}>
                          {c.refs.map((r, i) => (
                            <Text key={i} fontSize="sm">• {r}</Text>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                  <Flex align="center" mr={6}>
                    <Box
                      mr={4}
                      mb={8}
                      color={likesState[c.idComment]?.disliked ? "red.500" : "gray.500"}
                      _hover={{ color: likesState[c.idComment]?.disliked ? "red.600" : "gray.700", cursor: "pointer" }}
                      onClick={() => handleDislike(c.idComment)}
                    >
                      <FaThumbsDown />
                    </Box>
                    <Box
                      mr={6}
                      mb={10}
                      color={likesState[c.idComment]?.liked ? "blue.500" : "gray.500"}
                      _hover={{ color: likesState[c.idComment]?.liked ? "blue.600" : "gray.700", cursor: "pointer" }}
                      onClick={() => handleLike(c.idComment)}
                    >
                      <FaThumbsUp />
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
