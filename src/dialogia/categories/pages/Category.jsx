import { useEffect } from 'react';
import React, { useState,  } from "react";
import { Box, Heading, Text, Image, Flex, Button } from "@chakra-ui/react";
import { FaEye, FaCommentAlt, FaPlus, FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CategoryView from '../../views debate/CategoryView';
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
        mb={[4, 6, 8]}
        m={[4, 6, 8]}
      >
        {/* Category Image */}
        <Image
          src= {category.background}
          alt={category.name}
          maxH={["40vh", "50vh", "70vh"]}
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
            fontSize={["40px", "50px", "60px"]}
            mt={["20px", "40px", "60px"]}
            ml={["20px", "30px", "40px"]}
            mb={["20px", "30px", "40px"]}
          >
            {category.name.toUpperCase()}
          </Heading>
          <Text
            fontSize={["14px", "16px", "18px"]}
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
          mb={4}
          width="fit-content"
        >
          {buttons.map((btn, index) => (
            <Button
              key={btn}
              fontSize="md"
              p={[4, 6, 8]}
              bg={activeButton === btn ? "rgba(5, 5, 5, 0.7)" : "transparent"}
              color="white"
              _hover={{ bg: "rgba(10, 10, 10, 0.4)" }}
              onClick={() => {setActiveButton(btn); setIndex(index)}}
              borderTopLeftRadius={index === 0 ? "full" : 0}
              borderBottomLeftRadius={index === 0 ? "full" : 0}
              borderTopRightRadius={index === buttons.length - 1 ? "full" : 0}
              borderBottomRightRadius={index === buttons.length - 1 ? "full" : 0}
            >
              {btn.toUpperCase()}
            </Button>
          ))}
        </Flex>
      </Box>

      {/* Management Bar */}
      <Box ml={[4, 6, 8]} mb={[4, 6, 8]}>
        <Flex align="center" justifyContent="space-between" flexWrap="wrap">
          {/* Left group */}
          <Flex align="center" gap={4} mb={[2, 0]}>
            <Text fontWeight="bold" fontSize={["sm", "md", "lg"]}>
              Publicaciones encontradas
            </Text>
            <Text fontWeight="bold" color="gray.500" fontSize={["sm", "md", "lg"]}>
              {quantity} resultados.
            </Text>
            <CreateDebateDialog
            triggerButton={
              <Button
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              fontSize={["sm", "md", "lg"]}
              mb={[2, 0]}
              >
                Agregar debate <FaPlus color="white" style={{ marginLeft: "4px" }} />
              </Button>
            }
            categoryId={id}
          />
            
          </Flex>
          {/* Right search bar */}
          <form onSubmit={handleSearch}>
            <Box display="flex" alignItems="center">
              <button type="submit">
                <FaSearch color="gray" style={{ marginRight: "8px" }} />
              </button>
              <Box
                as="input"
                placeholder="Buscar un debate"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                px={4}
                py={1}
                width={["70vw", "30vw", "50vw"]}
                textAlign="left"
                fontSize={["sm", "md", "lg"]}
                value={inputValue} // Usa inputValue, no searchQuery
                onChange={(e) => setInputValue(e.target.value)} // Actualiza solo el estado temporal
                onKeyDown={handleKeyDown}
              />
            </Box>
          </form>
        </Flex>
      </Box>

      {/* Posts */}
      <CategoryView category ={category.id} sortType = {index} search={searchQuery} quantity= {setQuantity} />
      {/* <Box ml={[4, 6, 8]}>
        {posts.map((post) => (
          <Box
            key={post.id}
            bg="gray.100"
            p={4}
            borderRadius="lg"
            mb={1}
            m={2}
            transition="background-color 0.3s ease-in-out, opacity 0.3s ease-in-out"
            _hover={{ bg: "rgba(183, 183, 183, 0.67)", opacity: 0.8 }}
          >
            <Flex align="center" flexWrap="wrap">
              <Image
                src={post.avatar}
                maxH="60px"
                maxW="60px"
                objectFit="cover"
                mr={3}
                mb={[2, 0]}
              />
              <Box flex="1" minW="200px">
                <Flex align="center" flexWrap="wrap">
                  <Text fontWeight="bold" mr={2} fontSize={["sm", "md", "lg"]}>
                    {post.user}
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="bold">
                    {post.date}
                  </Text>
                </Flex>
                <Text mt={1} color="gray.700" fontSize={["sm", "md", "lg"]}>
                  {post.text}
                </Text>
              </Box>
              <Flex align="center" color="gray.600" fontSize={["sm", "md", "lg"]}>
                <FaEye style={{ marginRight: "4px" }} />
                <Text>{post.views}</Text>
              </Flex>
            </Flex>
            <Flex mt={2} justifyContent="flex-end" alignItems="center" color="gray.600" fontSize={["sm", "md", "lg"]}>
              <Flex align="center" mr={4}>
                <FaCommentAlt style={{ marginRight: "4px", color: "rgba(25, 174, 255, 0.75)" }} />
                <Text>{post.favor} respuestas a favor</Text>
              </Flex>
              <Flex align="center">
                <FaCommentAlt style={{ marginRight: "4px", color: "red" }} />
                <Text>{post.against} respuestas en contra</Text>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Box> */}
    </Box>
  );
};

export default Category;
