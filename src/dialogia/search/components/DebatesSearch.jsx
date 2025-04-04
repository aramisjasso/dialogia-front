import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Flex, Link, Button, ButtonGroup } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DebatesSearch = ({ search }) => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const debatesPerPage = 10;
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/debates/search?term=${search}`);
        setDebates(response.data);
        setCurrentPage(1); // Resetear a la primera página al hacer nueva búsqueda
      } catch (err) {
        setError("Error al cargar los debates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, [search]);

  // Calcular debates para la página actual
  const indexOfLastDebate = currentPage * debatesPerPage;
  const indexOfFirstDebate = indexOfLastDebate - debatesPerPage;
  const currentDebates = debates.slice(indexOfFirstDebate, indexOfLastDebate);
  const totalPages = Math.ceil(debates.length / debatesPerPage) || 1;

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
      <Heading as="h1" size="2xl" textAlign="center" mb={6} fontWeight="bold">
        Resultados de: {search}
      </Heading>

      {debates.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Text fontSize="xl">No se encontraron debates con el término "{search}"</Text>
        </Box>
      ) : (
        <>
          {currentDebates.map((debate, index) => (
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

              {index < currentDebates.length - 1 && (
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

          {/* Paginación */}
          {totalPages > 1 && (
            <Flex justifyContent="center" mt={8} alignItems="center">
              <ButtonGroup variant="outline" spacing={2}>
                {/* Botón Anterior - se deshabilita en la primera página */}
                <Button 
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  opacity={currentPage === 1 ? 0.5 : 1}
                  cursor={currentPage === 1 ? "not-allowed" : "pointer"}
                  _hover={currentPage === 1 ? { bg: "transparent" } : {}}
                  pointerEvents={currentPage === 1 ? "none" : "auto"}
                >
                  Anterior
                </Button>

                {/* Páginas numeradas */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  
                  if (totalPages <= maxVisible) {
                    // Mostrar todas las páginas si son 5 o menos
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <Button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          colorScheme={currentPage === i ? "blue" : "gray"}
                          variant={currentPage === i ? "solid" : "outline"}
                          size="sm"
                          fontWeight={currentPage === i ? "bold" : "normal"}
                          borderWidth={currentPage === i ? "2px" : "1px"}
                        >
                          {i}
                        </Button>
                      );
                    }
                  } else {
                    // Siempre mostrar la primera página
                    pages.push(
                      <Button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        colorScheme={currentPage === 1 ? "blue" : "gray"}
                        variant={currentPage === 1 ? "solid" : "outline"}
                        size="sm"
                        fontWeight={currentPage === 1 ? "bold" : "normal"}
                        borderWidth={currentPage === 1 ? "2px" : "1px"}
                      >
                        1
                      </Button>
                    );

                    // Calcular páginas intermedias
                    let startMiddle = Math.max(2, currentPage - 1);
                    let endMiddle = Math.min(totalPages - 1, currentPage + 1);

                    // Ajustar cuando estamos cerca de los extremos
                    if (currentPage <= 3) {
                      endMiddle = 4;
                    } else if (currentPage >= totalPages - 2) {
                      startMiddle = totalPages - 3;
                    }

                    // Mostrar puntos suspensivos si hay un gap
                    if (startMiddle > 2) {
                      pages.push(<Text key="left-ellipsis" mx={1}>...</Text>);
                    }

                    // Mostrar páginas intermedias
                    for (let i = startMiddle; i <= endMiddle; i++) {
                      pages.push(
                        <Button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          colorScheme={currentPage === i ? "blue" : "gray"}
                          variant={currentPage === i ? "solid" : "outline"}
                          size="sm"
                          fontWeight={currentPage === i ? "bold" : "normal"}
                          borderWidth={currentPage === i ? "2px" : "1px"}
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Mostrar puntos suspensivos si hay un gap
                    if (endMiddle < totalPages - 1) {
                      pages.push(<Text key="right-ellipsis" mx={1}>...</Text>);
                    }

                    // Siempre mostrar la última página
                    pages.push(
                      <Button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        colorScheme={currentPage === totalPages ? "blue" : "gray"}
                        variant={currentPage === totalPages ? "solid" : "outline"}
                        size="sm"
                        fontWeight={currentPage === totalPages ? "bold" : "normal"}
                        borderWidth={currentPage === totalPages ? "2px" : "1px"}
                      >
                        {totalPages}
                      </Button>
                    );
                  }

                  return pages;
                })()}

                {/* Botón Siguiente - se deshabilita en la última página */}
                <Button 
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  opacity={currentPage === totalPages ? 0.5 : 1}
                  cursor={currentPage === totalPages ? "not-allowed" : "pointer"}
                  _hover={currentPage === totalPages ? { bg: "transparent" } : {}}
                  pointerEvents={currentPage === totalPages ? "none" : "auto"}
                >
                  Siguiente
                </Button>
              </ButtonGroup>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default DebatesSearch;