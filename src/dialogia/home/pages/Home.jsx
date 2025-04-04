import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import RecommendView from '../../views debate/RecommendView';
import ActiveView from '../../views debate/ActiveView';
import CategoryView from '../../views debate/CategoryView';
import { toaster } from "../../../components/ui/toaster";
import { Box, Link, For , Stack, Text, Button, Flex } from "@chakra-ui/react";
import CreateDebateDialog from '../../categories/components/CreateDebateDialog';
const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  
    // Obtener categorías desde la API
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/category`);
          if (!response.ok) throw new Error("Error al obtener categorías");
          const data = await response.json();
          const sortedData = [...data].sort((a, b) => a.order - b.order);  // Ordenar copia por id
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
    <Box>
      <Flex  
      p={2} 
      px={6}                    
      justifyContent="space-between" 
      alignItems="center" 
      >
      <Stack fontSize="xs">
        <Text fontWeight="bold">{new Date().toLocaleDateString('es-ES', { weekday: 'long'}).toUpperCase()}</Text>
        <Text>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
      </Stack>
        <For each={categories}>
          {(category) => (
            <Link 
              color='#757575'
              key={category.id}
              
              fontSize="xs"
              onClick={() => navigate(`/category/${category.id}`)}  // 🔥 Navega usando useNavigate()
              style={{ cursor: "pointer" }}       // Para que parezca un enlace
            >
              {category.name.toUpperCase()}
            </Link>
          )}
        </For>
        <CreateDebateDialog
            triggerButton={
              <Button colorScheme="blue">Crear Debate</Button>
            }
          />
      </Flex>
      <RecommendView />
    </Box>
    
  );
};

export default Home;