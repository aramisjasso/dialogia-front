// src/dialogia/profile/components/PreferencesSection.jsx
import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Heading, 
  Flex, 
  Wrap, 
  WrapItem,
  Text
} from "@chakra-ui/react";
import { auth } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster";

const PreferencesSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener categorías disponibles e intereses del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_URL}/category`);
        if (!categoriesResponse.ok) throw new Error("Error al obtener categorías");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Obtener intereses del usuario
        const user = auth.currentUser;
        if (user) {
          const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/${user.uid}`);
          if (!userResponse.ok) throw new Error("Error al obtener datos del usuario");
          const userData = await userResponse.json();
          setSelectedInterests(userData.interests || []);
        }
      } catch (error) {
        console.error("Error:", error);
        toaster.create({
          description: "Error al cargar datos",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleInterest = (categoryId) => {
    setSelectedInterests(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      toaster.create({
        description: "Selecciona al menos un interés",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.uid}/interests`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interests: selectedInterests }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar intereses");

      toaster.create({
        description: "Preferencias actualizadas correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      toaster.create({
        description: "No se pudieron guardar las preferencias",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="lg">Cargando preferencias...</Heading>
      </Box>
    );
  }

  return (
    <Box w="100%">
      <Heading size="xl" mb={8}>
        Preferencias
      </Heading>
      
      <Heading size="md" mb={4}>
        Tus categorías de interés:
      </Heading>
      
      <Wrap spacing={4} mb={8}>
        {categories.map((category) => (
          <WrapItem key={category.id}>
            <Button
              size="lg"
              variant={selectedInterests.includes(category.id) ? "solid" : "outline"}
              colorScheme={selectedInterests.includes(category.id) ? "blue" : "gray"}
              onClick={() => toggleInterest(category.id)}
            >
              {category.name}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
      
      <Flex justify="flex-end">
        <Button
          size="lg"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Guardando..."
          onClick={handleSubmit}
        >
          Guardar Cambios
        </Button>
      </Flex>
    </Box>
  );
};

export default PreferencesSection;