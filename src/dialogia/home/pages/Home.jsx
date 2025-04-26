import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Box, Link, Stack, Text, Button, Flex, 
  useBreakpointValue, Grid, GridItem, Heading
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import RecommendView from '../../views debate/RecommendView';
import PopularView from '../../views debate/PopularView';
import { toaster } from "../../../components/ui/toaster";
import CreateDebateDialog from '../../categories/components/CreateDebateDialog';
import { useAuth } from '../../../contexts/hooks/useAuth';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuth();
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
        toaster.create({
          title: "Error",
          description: error.message,
          status: "error",
          type: "error",
        });
      }
    };
    fetchCategories();
  }, []);


  return (
    <Box maxW="100vw" overflowX="hidden">
      <Flex
        p={2}
        px={{ base: 2, md: 6 }}
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={10}
      >
        {/* Fecha - siempre visible */}
        <Stack fontSize="xs" minW="120px">
          <Text fontWeight="bold">
            {currentDate.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()}
          </Text>
          <Text>
            {currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </Stack>

        {/* Categorías - desktop */}
        <Flex 
          flex={1}
          mx={4}
          justifyContent="center"
          display={{ base: 'none', md: 'flex' }}
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          <Flex gap={4} alignItems="center">
            {categories.map((category) => (
              <Link
                key={category.id}
                color="#757575"
                fontSize="xs"
                whiteSpace="nowrap"
                onClick={() => navigate(`/category/${category.id}`)}
                _hover={{ 
                  textDecoration: "none", 
                  color: "blue.500",
                  transform: "translateY(-2px)"
                }}
                transition="all 0.2s"
              >
                {category.name.toUpperCase()}
              </Link>
            ))}
          </Flex>
        </Flex>

        {/* Menú de categorías para móviles */}
        {isMobile && (
          <Box position="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              leftIcon={<FiMenu />}
            >
              Categorías
            </Button>
            
            {isMenuOpen && (
              <Box
                position="absolute"
                right={0}
                mt={2}
                bg="white"
                boxShadow="md"
                borderRadius="md"
                zIndex={20}
                minW="200px"
                maxH="300px"
                overflowY="auto"
              >
                {categories.map((category) => (
                  <Box
                    key={category.id}
                    px={4}
                    py={2}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    onClick={() => {
                      navigate(`/category/${category.id}`);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text fontSize="sm">
                      {category.name.toUpperCase()}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Botón Crear Debate - siempre visible */}
        <Box minW="120px" textAlign="right">
            
          <CreateDebateDialog
            triggerButton={
              <Button 
                colorScheme="blue" 
                size={{ base: "sm", md: "md" }}
                width={{ base: "full", md: "auto" }}
              >
                Crear Debate
              </Button>
            }
          />
        </Box>
      </Flex>

      <Box p={{ base: 2, md: 4 }}>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "30% 30% 20% 20%"
          }}
          gap={{ base: 4, md: 6 }}
        >
          <GridItem>
            <Heading as="h1" size="2xl" textAlign="center" mb={6}  fontWeight="bold">
              Tus Favoritos
            </Heading>
            <Text textAlign="center" fontStyle="italic" color="gray.500">Próximamente...</Text>
          </GridItem>
          <GridItem>
            <RecommendView
              interests={user.currentUser.interests} 
            />
          </GridItem>
          <GridItem>
            <PopularView />
          </GridItem>
          <GridItem>
            <Heading as="h1" size="2xl" textAlign="center" mb={6}  fontWeight="bold">
              Ranking
            </Heading>
            <Text textAlign="center"  fontStyle="italic" color="gray.500">Próximamente...</Text>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;