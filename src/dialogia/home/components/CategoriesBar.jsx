import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Link, Stack, Text, Button, Flex, useBreakpointValue, IconButton } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import CreateDebateDialog from '../../categories/components/CreateDebateDialog';
import { FaChartLine } from "react-icons/fa"; 

const CategoriesBar = () => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentDate = new Date();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/category`);
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.order - b.order);
        setCategories(sortedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
    
  return (
    <Flex
      p={1} // Reducido de 2
      px={{ base: 1, md: 4 }} // Reducido de 6
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
      height="40px" // Altura fija más compacta
    >
      {/* Fecha más compacta */}
      <Stack fontSize="2xs" minW="90px" spacing={0}>
        <Text fontWeight="bold" lineHeight="tight">
          {currentDate.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()}
        </Text>
        <Text>
          {currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
        </Text>
      </Stack>

      {/* Categorías - desktop */}
      <Flex 
        flex={1}
        mx={2} // Reducido de 4
        justifyContent="center"
        display={{ base: 'none', md: 'flex' }}
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        alignItems="center"
      >
        <Flex gap={1} alignItems="center"> {/* Reducido de 4 */}
          {categories.map((category) => (
            <Link
              key={category.id}
              color="#757575"
              fontSize="2xs" // Más pequeño
              whiteSpace="nowrap"
              onClick={() => navigate(`/category/${category.id}`)}
              _hover={{ 
                textDecoration: "none", 
                color: "blue.500",
                transform: "translateY(-1px)" // Efecto más sutil
              }}
              transition="all 0.1s" // Más rápido
              px={1} // Menos padding
            >
              {category.name.toUpperCase()}
            </Link>
          ))}
        </Flex>
      </Flex>

      {/* Menú de categorías para móviles más compacto */}
      {isMobile && (
        <Box position="relative">
          <IconButton
            variant="outline"
            size="xs"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Categorías"
          >
            <FiMenu size={14} />
          </IconButton>
          
          {isMenuOpen && (
            <Box
              position="absolute"
              right={0}
              mt={1}
              bg="white"
              boxShadow="md"
              borderRadius="md"
              zIndex={20}
              minW="150px"
              maxH="250px"
              overflowY="auto"
            >
              {categories.map((category) => (
                <Box
                  key={category.id}
                  px={3}
                  py={1}
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                  onClick={() => {
                    navigate(`/category/${category.id}`);
                    setIsMenuOpen(false);
                  }}
                >
                  <Text fontSize="xs"> {/* Más pequeño */}
                    {category.name.toUpperCase()}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Botones más compactos */}
      <Flex minW="100px" justify="flex-end" gap={1}>

        <CreateDebateDialog
          triggerButton={
            <Button 
              colorScheme="blue" 
              size="xs" // Más pequeño
            >
              Crear Debate
            </Button>
          }
        />
      </Flex>
    </Flex>
  );
};

export default CategoriesBar;