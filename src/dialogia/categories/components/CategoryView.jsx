import React, { useEffect, useState, useMemo } from "react";
import { 
  Box, Heading, Text, Spinner, Flex, Stack, 
  Button, ButtonGroup, Avatar, Grid, GridItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaCommentAlt } from "react-icons/fa";
import { toaster } from "../../../components/ui/toaster";
import { useAuth } from '../../../contexts/hooks/useAuth';

const CategoryView = ({category, sortType, search, quantity }) => {
  const [allDebates, setAllDebates] = useState([]); // Todos los debates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const debatesPerPage = 10; // Número de debates por página
  const { currentUser} = useAuth();
  const [censorship, setCensorship] = useState(currentUser.censorship);
  const navigate = useNavigate();
  const querry = ['active','recent','popular','ancient'];

  // Obtener todos los debates una sola vez
  useEffect(() => {
    const fetchDebates = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/debates/category/${category}?sort=${querry[sortType]}&search=${search}&censored=${censorship}`
        );
        setAllDebates(response.data);
        quantity(response.data.length);
        // Obtener intereses del usuario
      
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
<Box maxW="auto" mx="auto" p={6}>
  <Stack spacing={4}>
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
          bg="gray.100"
          p={2}
          borderRadius="xl"  // Redondeo más pronunciado
        
          
          transition="background-color 0.3s ease-in-out, opacity 0.3s ease-in-out"
          _hover={{ bg: "rgba(183, 183, 183, 0.67)", opacity: 0.8 }}
          onClick={() => navigate(`/debate/${debate.idDebate}`)}
        >
          <Grid templateColumns="1fr auto" gap={4} alignItems="center">  {/* Grid con dos columnas */}
            {/* Columna de la izquierda: Avatar, Username, Argumento */}
            <Flex align="center" flexWrap="wrap" fontSize="sm">
              <Avatar.Root size="sm" mr={2}>  {/* Avatar más pequeño */}
                <Avatar.Fallback delayMs={600}>{`A${debate?.user?.id}`}</Avatar.Fallback>
                <Avatar.Image
                  src={`/avatar_${debate?.user?.avatarId || "1"}.jpg`}
                  alt={`Avatar ${debate?.user?.id}`}
                />
              </Avatar.Root>
              <Box flex="1" minW="150px">  {/* Ajustar el tamaño del contenedor */}
                <Flex align="center" flexWrap="wrap">
                  <Text fontWeight="bold" mr={2} fontSize="sm">
                    {debate.username}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    {new Date(debate.datareg).toLocaleDateString("es-ES")}
                  </Text>
                </Flex>
                <Text mt={1} color="gray.700" fontSize="sm">
                  {debate.nameDebate}
                </Text>
              </Box>
            </Flex>

            {/* Columna de la derecha: Visualizaciones y Comentarios */}
            <Flex direction="column" align="flex-end" fontSize="sm">
              {/* Visualizaciones - arriba a la derecha */}
              <Flex align="center" color="gray.600" mb={2}>
                <FaEye style={{ marginRight: "4px" }} />
                {debate.popularity}
              </Flex>

              {/* Comentarios - abajo a la derecha */}
              <Flex justify="flex-end" align="center" color="gray.600" fontSize="sm">
                <Flex align="center" mr={4}>
                  <FaCommentAlt style={{ marginRight: "4px", color: "rgba(25, 174, 255, 0.75)" }} />
                  <Text>{countTrue} a favor</Text>
                </Flex>
                <Flex align="center">
                  <FaCommentAlt style={{ marginRight: "4px", color: "red" }} />
                  <Text>{countFalse}  en contra</Text>
                </Flex>
              </Flex>
            </Flex>
          </Grid>
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