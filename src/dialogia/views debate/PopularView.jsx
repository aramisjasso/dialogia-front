import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Flex, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PopularView = ({censored}) => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/debates/popular?censored=${censored}`);
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
    <Box maxW="800px" mx="auto">
      <Heading as="h1" size="2xl" textAlign="center" mb={6}  fontWeight="bold">
        Debates más activos
      </Heading>

      {debates.map((debate, index) => (

        <React.Fragment key={debate.idDebate}>
          <Box p={4} _hover={{ bg: "gray.50" }} onClick={() => navigate(`/debate/${debate.idDebate}`)} cursor="pointer"> 
            <Flex align="center" mb={2}>
              <Box
                display="inline-block"
                border="1px solid"
                borderColor="gray.200"
                px={3}
                py={1}
                fontSize="sm"
                fontWeight="500"
              >
                {debate.category.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase()+ word.slice(1)).join(' ')}
              </Box>
              <Text fontSize="sm" color="gray.500" ml={3}>
                {new Date(debate.datareg).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }).replace(/(\d{1,2}) de (\w+) (\d{4})/, "$1 de $2, $3")}
              </Text>
            </Flex>
            
            <Heading as="h1" fontSize="lg">  
              {debate.nameDebate}
            </Heading>
            <Text 
              display="inline-block" 
              color="#979797" 
              textDecoration="underline" 
              fontSize="sm"
              fontWeight="bold"
            >
              Ver más
            </Text>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default PopularView;