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
import { FaReply, FaCommentAlt, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
export default function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const handleClick = () => setIsClicked(!isClicked);
  const handleClick2 = () => setIsClicked2(!isClicked2);

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}`
        );
        if (!response.ok) throw new Error('Error al obtener debate');
        const data = await response.json();
        setComments(data.comments || []);
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

  const inFavor = comments.filter((c) => c.position);
  const against = comments.filter((c) => !c.position);

  const TotalinFavor = comments.filter((c) => c.position).length;
  const Totalagainst = comments.filter((c) => !c.position).length;
  return (
    <Box p={6}>
      <Heading mb={4}>Comentarios del Debate</Heading>
      <Flex>
        {/* Columna Izquierda: A favor */}
        <Box flex={1} pr={4}>
        <Flex>
        <Heading size="md" mb={2}>
            Comentarios a favor
          </Heading>
          <Text ml={4} fontWeight="bold" color="gray.600">5024 resultados</Text>
        </Flex>
          
          <VStack spacing={4} align="stretch">
            {inFavor.map((c, idx) => (
              <Box
              key={idx}
              bg="gray.100"
              p={4}
              borderRadius="lg"
              mb={1}
              m={2}
            >
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
                    <Box
                    color="gray.500"
                    _hover={{ color: "gray.800", cursor: "pointer" }}
                    >
                        <FaReply/>
                    </Box>    
                        <Text ml={2} fontWeight="bold">Responder</Text>
                    </Flex>
                  </Flex>
                  <Text mt={1} color="gray.700" fontSize={["sm", "md", "lg"]}>
                    {c.argument}
                  </Text>
                  {c.refs && c.refs.length > 0 && (
                  <Box mt={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Referencias:
                    </Text>
                    <VStack align="start" spacing={1} mt={1}>
                      {c.refs.map((r, i) => (
                        <Text key={i} fontSize="sm">
                          • {r}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                )}

                </Box>
                <Flex align="center" mr={6}>
                <Box mr={4} mb={8}
                color={isClicked ? "red.500" : "gray.500"}
                _hover={{ color: isClicked ? "red.600" : "gray.700", cursor: "pointer" }}
                onClick={handleClick}
                >
                    <FaThumbsDown  />
                </Box>
                <Box mr={6} mb={10}  color={isClicked2 ? "blue.500" : "gray.500"}
                _hover={{ color: isClicked2 ? "blue.600" : "gray.700", cursor: "pointer" }}
                onClick={handleClick2}>
                    <FaThumbsUp  />
                </Box>
                </Flex>
              </Flex>
            </Box>
  
            ))}
          </VStack>
        </Box>

        {/* Columna Derecha: En Contra */}
        <Box flex={1} pl={4}>
          <Heading size="md" mb={2} color="black">
            En Contra
          </Heading>
          <VStack spacing={4} align="stretch">
            {against.map((c, idx) => (
              <Box key={idx} p={4} bg="gray.100" borderRadius="md" shadow="sm">
                <Text fontWeight="bold" color="black">
                  {c.username}
                </Text>
                <Text mt={2} color="black">
                  {c.argument}
                </Text>
                {c.refs && c.refs.length > 0 && (
                  <Box mt={2}>
                    <Text fontSize="sm" fontWeight="semibold" color="black">
                      Referencias:
                    </Text>
                    <VStack align="start" spacing={1} mt={1}>
                      {c.refs.map((r, i) => (
                        <Text key={i} fontSize="sm" color="black">
                          • {r}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
