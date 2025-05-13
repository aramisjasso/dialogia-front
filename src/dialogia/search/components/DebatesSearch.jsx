import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  Button,
  ButtonGroup
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../../../contexts/hooks/useAuth';

const DebatesSearch = ({ search }) => {
  const [debates, setDebates]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [censorship, setCensorship] = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [sortFavor, setSortFavor]       = useState("recent");
  const debatesPerPage                  = 10;
  const navigate                        = useNavigate();
  const { currentUser} = useAuth();

  // 1) Traer debates cada vez que cambia el término
  useEffect(() => {
    const fetchDebates = async () => {
      try {
        setLoading(true);  
        setCensorship(currentUser.censorship);
        
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/debates/search?term=${search}&censored=${censorship}`
        );
        setDebates(data);
        setCurrentPage(1); // reset
      }catch (err) {
        console.error(err);
        setError("Error al cargar los debates");
      } finally {
        setLoading(false);
      }
    };
    if (search) fetchDebates();
  }, [search]);

  // 2) Función para ordenar debates
  const sortDebates = (arr, mode) => {
    const a = [...arr];
    if (mode === "oldest") {
      return a.sort((x, y) => new Date(x.datareg) - new Date(y.datareg));
    }
    if (mode === "liked") {
      return a.sort((x, y) => (y.likes ?? 0) - (x.likes ?? 0));
    }
    if (mode === "controversial") {
      return a.sort((x, y) => (y.dislikes ?? 0) - (x.dislikes ?? 0));
    }
    // recent
    return a.sort((x, y) => new Date(y.datareg) - new Date(x.datareg));
  };

  // 3) Aplico orden, luego pagino
  const sortedDebates = sortDebates(debates, sortFavor);
  const indexLast     = currentPage * debatesPerPage;
  const indexFirst    = indexLast - debatesPerPage;
  const currentDebates= sortedDebates.slice(indexFirst, indexLast);
  const totalPages    = Math.ceil(sortedDebates.length / debatesPerPage) || 1;

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
    <Box w="100%" mx="auto">
      {/* —— Cabecera con número de resultados y select de orden —— */}
      <Flex
        align="center"
        justify="space-between"
        flexWrap="wrap"
        background="white"
        border="1px solid rgb(214, 214, 214)"
        px={6}
        py={4}
      >
        <Text fontSize="lg">
          Mostrando{" "}
          <Text as="span" fontWeight="bold">
            {debates.length}
          </Text>{" "}
          resultados
        </Text>

        <Flex align="center" fontWeight={"semibold"}>
        <Text fontSize="lg">
          Ordenar por:
        </Text>
        <select
          style={{
            marginLeft: 16,
            padding: "8px 16px 8px",
            border: "1px solid #CBD5E0",
            borderRadius: "4px",
            background: "white",
            color: "#3d3d3d"
          }}
          value={sortFavor}
          onChange={(e) => {
            setSortFavor(e.target.value);
            setCurrentPage(1); // resetear página al cambiar orden
          }}
        >
          <option value="recent">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="liked">Más gustados</option>
          <option value="controversial">Controvertidos</option>
        </select>
        </Flex>

      </Flex>

      {debates.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Text fontSize="xl">
            No se encontraron debates con el término "{search}"
          </Text>
        </Box>
      ) : (
        <>
          {/* —— Lista paginada —— */}
          {currentDebates.map((debate, idx) => (
            <React.Fragment key={debate.idDebate}>
              <Box
                p={4}
                _hover={{ bg: "gray.100" }}
                cursor="pointer"
                onClick={() => navigate(`/debate/${debate.idDebate}`)}
              >
                {/* ... Tu markup de cada debate ... */}
                <Flex align="center" m={0}>
                  <Box
                    display="inline-block"
                    border="1px solid"
                    borderColor="gray.200"
                    px={3}
                    fontSize="sm"
                    fontWeight="500"
                  >
                    {debate.category
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (w) =>
                          w.charAt(0).toUpperCase() +
                          w.slice(1)
                      )
                      .join(" ")}
                  </Box>
                  <Text fontSize="sm" color="gray.500" ml={3}>
                    {new Date(
                      debate.datareg
                    ).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </Text>
                </Flex>
                <Heading size="md" mb={2} mt={2} fontSize="lg">
                  {debate.nameDebate}
                </Heading>
                <Text mb={2} color="#A9A9A9" fontSize="md">
                  {debate.argument}
                </Text>
                {/* <Text
                  display="inline-block"
                  color="#979797"
                  textDecoration="underline"
                  fontSize="md"
                  fontWeight="bold"
                >
                  Ver más
                </Text> */}
              </Box>
              {idx < currentDebates.length - 1 && (
                <Box
                  h="1px"
                  bgImage="linear-gradient(to right, gray 50%, transparent 50%)"
                  bgSize="4px 1px"
                  bgRepeat="repeat-x"                 
                />
              )}
            </React.Fragment>
          ))}

          {/* —— Paginación —— */}
          {totalPages > 1 && (
            <Flex justify="center" mt={8} align="center" mb={8}>
              <ButtonGroup variant="outline" spacing={2}>
                <Button
                  onClick={() =>
                    currentPage > 1 &&
                    setCurrentPage(currentPage - 1)
                  }
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  isDisabled={currentPage === 1}
                >
                  Anterior
                </Button>

                {/* Páginas numeradas */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <Button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      size="sm"
                      colorScheme={currentPage === num ? "blue" : "gray"}
                      variant={
                        currentPage === num ? "solid" : "outline"
                      }
                      fontWeight={
                        currentPage === num ? "bold" : "normal"
                      }
                    >
                      {num}
                    </Button>
                  )
                )}

                <Button
                  onClick={() =>
                    currentPage < totalPages &&
                    setCurrentPage(currentPage + 1)
                  }
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
        </>
      )}
    </Box>
  );
};

export default DebatesSearch;
