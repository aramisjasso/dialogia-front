import React, { useEffect, useState, useMemo } from "react";
import { 
  Box, Heading, Text, Spinner, Flex, Stack, 
  Button, ButtonGroup 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaCommentAlt } from "react-icons/fa";
import { toaster } from "../../components/ui/toaster";
import { auth } from "../../firebase/firebase";

const CategoryView = ({category, sortType, search, quantity }) => {
  const [allDebates, setAllDebates] = useState([]); // Todos los debates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [censorship, setCensorship] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const debatesPerPage = 10; // Número de debates por página

  const navigate = useNavigate();
  const querry = ['active','recent','popular','ancient'];

  // Obtener todos los debates una sola vez
  useEffect(() => {
    const fetchDebates = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const userResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/user/${user.uid}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log(userData)
            setCensorship(userData.censorship);
          }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/debates/category/${category}?sort=${querry[sortType]}&search=${search}&censored=${censorship}`
        );
        setAllDebates(response.data);
        quantity(response.data.length);
        // Obtener intereses del usuario
        
        }
      

      } catch (err) {
        setError("Error al cargar los debates");
        console.error(err);
        toaster.create({
          title: "Error",
          description: "No se pudieron cargar los debates",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, [sortType, search, category]);

  // Calcular debates paginados
  const { paginatedDebates, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * debatesPerPage;
    const endIndex = startIndex + debatesPerPage;
    const paginated = allDebates.slice(startIndex, endIndex);
    const total = Math.ceil(allDebates.length / debatesPerPage);
    
    return { paginatedDebates: paginated, totalPages: total };
  }, [allDebates, currentPage, debatesPerPage]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [sortType, search, category]);

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
      <Stack spacing={6}>
        {paginatedDebates.map((debate) => {
          let countTrue = 0;
          let countFalse = 0;
  
          debate.comments.forEach((comment) => {
            if (comment.position === true) countTrue++;
            else if (comment.position === false) countFalse++;
          });
  
          return (
            <Box 
              key={debate.idDebate}
              borderRadius="3xl"
              bg="#F0F0F0"
              p={2}
              onClick={() => navigate(`/debate/${debate.idDebate}`)}
              cursor="pointer"
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
                  <Text color="#727272">{debate.popularity}</Text>
                </Flex>
              </Flex>
  
              <Flex justify="space-between" alignItems="flex-end">
                <Heading as="h1" size="lg" fontWeight="bold" mb={0}>
                  {debate.nameDebate}
                </Heading>
  
                <Flex mt={4}>
                  <FaCommentAlt style={{ marginRight: "4px", color: "rgba(25, 174, 255, 0.75)" }} />  
                  <Text fontSize="sm" mr={4} color="#727272">{countTrue} respuestas a favor</Text>
                  <FaCommentAlt style={{ marginRight: "4px", color: "red" }} />  
                  <Text fontSize="sm" color="#727272">{countFalse} respuestas en contra</Text>
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Stack>

      {/* Paginación */}
      {totalPages > 1 && (
        <Flex justifyContent="center" mt={8} alignItems="center">
          <ButtonGroup variant="outline" spacing={2}>
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              size="sm"
              variant="outline"
              colorScheme="gray"
              isDisabled={currentPage === 1}
            >
              Anterior
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                colorScheme={currentPage === page ? "blue" : "gray"}
                variant={currentPage === page ? "solid" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            ))}

            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              size="sm"
              variant="outline"
              colorScheme="gray"
              isDisabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </ButtonGroup>
        </Flex>
      )}
    </Box>
  );
}

export default CategoryView;