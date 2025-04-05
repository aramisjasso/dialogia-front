// src/dialogia/interests/pages/SelectInterests.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Heading, 
  Flex, 
  Wrap, 
  WrapItem
} from "@chakra-ui/react";
import { auth } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster"

const SelectInterests = () => {
  const [categories, setCategories] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Obtener categorías disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/category`);
        if (!response.ok) {
          throw new Error("Error al obtener categorías");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error:", error);
        toaster.create({
          description: "No se pudieron cargar las categorías",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Manejar selección/deselección de intereses
  const toggleInterest = (categoryId) => {
    setSelectedInterests(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Enviar intereses seleccionados al servidor
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
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Obtener token de Firebase
      const token = await user.getIdToken();

      // Actualizar perfil del usuario
      const updateResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.uid}/interests`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
             
          },
          body: JSON.stringify({
            interests: selectedInterests,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Error al actualizar intereses");
      }

      toaster.create({
        description: "Intereses actualizados correctamente",
        type: "success",
      });
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      toaster.create({
        description: "No se pudieron guardar los intereses",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="lg">Cargando categorías...</Heading>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="container.md" mx="auto">
      <Heading size="xl" mb={8} textAlign="center">
        Selecciona tus intereses
      </Heading>
      
      <Heading size="md" mb={4}>
        Elige los temas que te interesan:
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
      
      <Flex justify="center">
        <Button
          size="lg"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Guardando..."
          onClick={handleSubmit}
          isDisabled={selectedInterests.length === 0}
        >
          Continuar
        </Button>
      </Flex>
    </Box>
  );
};

export default SelectInterests;