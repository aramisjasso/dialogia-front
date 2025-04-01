import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Flex, Stack } from "@chakra-ui/react";
import axios from "axios";
import { FaEye, FaCommentAlt } from "react-icons/fa";

const CategoryView = ({category}) => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/debates/category/${category}`);
        setDebates(response.data);
      } catch (err) {
        setError("Error al cargar los debates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10} color="red.500">
        <Text>{error}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="auto" mx="auto" p={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Debates por Categoría
      </Heading>

      <Stack spacing={6}>
        {debates.map((debate) => (
          <Box 
            key={debate.idDebate}
            borderRadius="3xl"
            bg="#F0F0F0"
            p={2}
          >
            <Flex justify="space-between">
                <Flex>
                <Text fontSize="sm" fontWeight="bold">{debate.username}</Text>
                <Text fontSize="sm" color="#727272" ml={3}> 
                    {new Date(debate.datareg).toLocaleDateString('es-ES')}
                </Text>
                </Flex>

                <Flex align="center">
                    <FaEye style={{ marginRight: "4px" }} /> 
                    <Text color="#727272">0</Text>
                </Flex>
            </Flex>
            <Flex justify="space-between" alignItems="flex-end">
                <Heading as="h1" size="lg" fontWeight="bold" mb={0}>
                {debate.nameDebate}
                </Heading>

                <Flex mt={4}>
                    <FaCommentAlt style={{ marginRight: "4px", color: "rgba(25, 174, 255, 0.75)" }} />  
                    <Text fontSize="sm" mr={4} color="#727272">0 respuestas a favor</Text>
                    <FaCommentAlt style={{ marginRight: "4px", color: "red" }} />  
                    <Text fontSize="sm" color="#727272">0 respuestas en contra</Text>
                </Flex>
              </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default CategoryView;