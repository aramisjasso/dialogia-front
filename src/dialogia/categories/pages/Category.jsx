import { useEffect } from 'react';
import React, { useState,  } from "react";
import { Box, Heading, Text, Image, Flex, Button } from "@chakra-ui/react";
import { FaEye, FaCommentAlt, FaPlus, FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CategoryView from '../components/CategoryView';
import CreateDebateDialog from "../components/CreateDebateDialog"; // Ajusta la ruta según tu estructura



const Category = () => {
  const { id } = useParams(); // Obtiene el ID de la URL

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);

  const [inputValue, setInputValue] = useState(""); // Estado temporal para el input
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue); // Fija el valor final
  };

  // Manejar Enter en el input
  const handleKeyDown = (e) => {
    if (e.key === "Enter" ) {
      setSearchQuery(inputValue); // Fija el valor final
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]); // Se ejecuta cuando el ID cambi
  
  const fetchCategory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/category/${id}`);
      if (!response.ok) throw new Error("Error al cargar la categoría");
      const data = await response.json();
      console.log(searchQuery)
      setCategory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const [activeButton, setActiveButton] = useState("activos");
  const [index, setIndex]=useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lista de botones a mostrar
  const buttons = ["activos", "recientes", "populares", "antiguos"];

  if (!category) return <div>Cargando...</div>;
  return (
    <Box>
      {/* Main Category Card */}

      <Box
        position="relative"
        overflow="hidden"
        borderRadius="lg"
        boxShadow="md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        cursor="pointer"
        mb={[0, 6, 6]}
        m={[0, 6, 6]}
      >
        {/* Category Image */}
        <Image
          src= {category.background}
          alt={category.name}
          maxH={["40vh", "40vh", "60vh"]}
          objectFit="cover"
          width="100%"
          height="auto"
        />

        {/* Top container for title and description */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          color="white"
          p={[2, 4, 6]}
        >
          <Heading
            fontSize={["xl", "2xl", "4xl"]}
            mt={[1, 1, 2]}
            ml={["20px", "30px", "40px"]}
            mb={[1, 1, 4]}
          >
            {category.name.toUpperCase()}
          </Heading>
          <Text
            fontSize={["sm", "md", "lg"]}
            mt="10px"
            ml={["20px", "30px", "45px"]}
            maxW={["300px", "350px", "400px"]}
          >
            {category.description}
          </Text>
        </Box>

        {/* Bottom container for category buttons */}
        <Flex
          position="absolute"
          bottom="0"
          left="50%"
          transform="translateX(-50%)"
          justify="center"
          bg="rgba(20, 20, 20, 0.4)"
          align="center"
          borderRadius="full"
          mb={[1, 2, 4]}
          
          width="fit-content"
        >
          {buttons.map((btn, index) => (
            <Button
              key={btn}
              fontSize={["2xs", "xs", "sm"]}
              p={[2, 4, 6]}
              bg={activeButton === btn ? "rgba(5, 5, 5, 0.7)" : "transparent"}
              color="white"
              _hover={{ bg: "rgba(10, 10, 10, 0.4)" }}
              onClick={() => {setActiveButton(btn); setIndex(index)}}
              borderTopLeftRadius={index === 0 ? "full" : 0}
              borderBottomLeftRadius={index === 0 ? "full" : 0}
              borderTopRightRadius={index === buttons.length - 1 ? "full" : 0}
              borderBottomRightRadius={index === buttons.length - 1 ? "full" : 0}
              mb={[0, 0, 0]}
            >
              {btn.toUpperCase()}
            </Button>
          ))}
        </Flex>
      </Box>

      {/* Management Bar */}
<Box mx={[4, 6, 6]}>
  <Flex 
    align="center" 
    justifyContent="space-between" 
    flexWrap="nowrap"
    width="100%"
    gap={3}
  >
    {/* Left group - Modificado para permitir saltos de línea */}
    <Flex 
      align="center" 
      gap={3}
      flexShrink={1}
      minWidth="min-content"
      flex="1 1 auto"
      overflow="hidden"
      flexWrap="wrap" 
      rowGap={1} 
    >
      <Text 
        fontWeight="bold" 
        fontSize={["2xs", "xs", "sm"]}
        whiteSpace="normal" 
        textOverflow="unset" 
        overflow="visible"
        flexShrink={1}
      >
        Publicaciones encontradas
      </Text>
      <Text 
        fontWeight="bold" 
        color="gray.500" 
        fontSize={["2xs", "xs", "sm"]}
        whiteSpace="normal" 
        flexShrink={1}
      >
        {quantity} resultados.
      </Text>
      
      <Box flexShrink={0} alignSelf="center"> 
        <CreateDebateDialog
          triggerButton={
            <Button
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              fontSize={["2xs", "xs", "sm"]}
              whiteSpace="nowrap"
              size="sm"
            >
              <Box as="span" display={["none", "inline"]}>Agregar </Box>
              debate <FaPlus color="white" style={{ marginLeft: "4px" }} />
            </Button>
          }
          categoryId={id}
        />
      </Box>
    </Flex>

    {/* Search bar - Sin cambios */}
    <Box 
      as="form" 
      onSubmit={handleSearch}
      flex="2 1 150px"
      minWidth="100px"
      maxWidth={["200px", "300px", "500px"]}
    >
      <Flex align="center" width="100%">
        <button type="submit">
          <FaSearch color="gray" style={{ marginRight: "4px" }} />
        </button>
        <Box
          as="input"
          placeholder="Buscar..."
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          px={3}
          py={1}
          width="100%"
          textAlign="left"
          fontSize={["2xs", "xs", "sm"]}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Flex>
    </Box>
  </Flex>
</Box>

      {/* debates */}
      <CategoryView category ={category.id} sortType = {index} search={searchQuery} quantity= {setQuantity} />

    </Box>
  );
};

export default Category;
