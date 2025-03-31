import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Flex, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecommendView = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await axios.get("http://localhost:3020/api/v1/debates");
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
    <Box maxW="800px" mx="auto" p={4}>
      <Heading as="h1" size="2xl" textAlign="center" mb={6}  fontWeight="bold">
        Recomendados para ti
      </Heading>

      {debates.map((debate, index) => (

        <React.Fragment key={debate.idDebate}>

          <Box p={4} _hover={{ bg: "gray.50" }} onClick={() => navigate(`/debate/${debate.idDebate}`)}>
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
                {debate.category.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Box>
              <Text fontSize="sm" color="gray.500" ml={3}>
                {new Date(debate.datareg).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }).replace(/(\d{1,2}) de (\w+) (\d{4})/, "$1 de $2, $3")}
              </Text>
            </Flex>
            
            <Heading as="h1" size="md" mb={2} fontSize="lg">  
              {debate.nameDebate}
            </Heading>

            <Text mb={2} color="#A9A9A9" fontSize="md"> 
              {debate.argument}
            </Text>
            <Text 
              display="inline-block" 
              color="#979797" 
              textDecoration="underline" 
              mt={2}
              fontSize="md"
              fontWeight="bold"
            >
              Ver más
            </Text>
          </Box>

          {index < debates.length - 1 && (
            <Box 
              h="1px"
              bgImage="linear-gradient(to right, gray 50%, transparent 50%)"
              bgSize="4px 1px"
              bgRepeat="repeat-x"
              my={2}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default RecommendView;