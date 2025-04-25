// src/dialogia/profile/pages/Profile.jsx
import { useState, useEffect } from "react";
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Avatar, 
  Button, 
  VStack, 
  Wrap, 
  WrapItem 
  
} from "@chakra-ui/react";
import { auth } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster";
import {
    useColorModeValue,
  } from "../../../components/ui/color-mode"
import DeleteAccount from "./DeleteAccount";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("preferences");
  const [categories, setCategories] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener categorías disponibles
  useEffect(() => {
    const fetchCategoriesAndInterests = async () => {
      setIsLoading(true);
      try {
        // Obtener categorías
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_URL}/category`);
        if (!categoriesResponse.ok) throw new Error("Error al obtener categorías");
        const categoriesData = await categoriesResponse.json();
        // Ordenar las categorías por el campo 'order' y luego por nombre
      const sortedCategories = [...categoriesData].sort((a, b) => {
        const orderA = Number(a.order);
        const orderB = Number(b.order);
        return orderA - orderB || a.name.localeCompare(b.name);
      });
      
      setCategories(sortedCategories);
        // Obtener intereses del usuario
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const userResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/user/${user.uid}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setSelectedInterests(userData.interests || []);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toaster.create({
          description: "Error al cargar datos del perfil",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndInterests();
  }, []);

  // Manejar selección/deselección de intereses
  const toggleInterest = (categoryId) => {
    setSelectedInterests(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Guardar preferencias
  const savePreferences = async () => {
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

      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.uid}/interests`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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

  // Color del borde divisorio
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box p={8} maxW="container.xl" mx="auto">
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={8}
        divideX={{ md: "1px" }}
        divideColor={dividerColor}
      >
        {/* Panel lateral izquierdo */}
        <Box w={{ md: "250px" }} flexShrink={0}>
          <VStack align="stretch" spacing={6}>
            <Flex direction="column" align="center">
              
            </Flex>
            
            <VStack align="stretch" spacing={2}>
              <Button 
                variant={activeSection === "profile" ? "solid" : "ghost"}
                justifyContent="flex-start"
                onClick={() => setActiveSection("profile")}
              >
                Perfil
              </Button>
              <Button 
                variant={activeSection === "badges" ? "solid" : "ghost"}
                justifyContent="flex-start"
                onClick={() => setActiveSection("badges")}
              >
                Insignias
              </Button>
              <Button 
                variant={activeSection === "activity" ? "solid" : "ghost"}
                justifyContent="flex-start"
                onClick={() => setActiveSection("activity")}
              >
                Actividad
              </Button>
              <Button 
                variant={activeSection === "preferences" ? "solid" : "ghost"}
                justifyContent="flex-start"
                onClick={() => setActiveSection("preferences")}
              >
                Preferencias
              </Button>
            </VStack>
          </VStack>
        </Box>
        
        {/* Contenido principal */}
        <Box flex={1} pl={{ md: 8 }}>
          {isLoading ? (
            <Text>Cargando...</Text>
          ) : (
            <>
              {activeSection === "profile" && (
                <Box>
                  <Heading size="lg" mb={6}>Perfil</Heading>
                  <Text>Información del perfil (en construcción)</Text>
                </Box>
              )}
              
              {activeSection === "badges" && (
                <Box>
                  <Heading size="lg" mb={6}>Insignias</Heading>
                  <Text>Tus insignias aparecerán aquí (en construcción)</Text>
                </Box>
              )}
              
              {activeSection === "activity" && (
                <Box>
                  <Heading size="lg" mb={6}>Actividad</Heading>
                  <Text>Tu actividad reciente (en construcción)</Text>
                </Box>
              )}
              
              {activeSection === "preferences" && (
                <Box>
                  <Heading size="lg" mb={6}>Preferencias</Heading>
                  <Text mb={4}>Selecciona tus categorías de interés:</Text>
                  
                  <Wrap spacing={4} mb={8}>
                    {categories.map((category) => (
                      <WrapItem key={category.id}>
                        <Button
                          size="md"
                          variant={selectedInterests.includes(category.id) ? "solid" : "outline"}
                          colorScheme={selectedInterests.includes(category.id) ? "blue" : "gray"}
                          onClick={() => toggleInterest(category.id)}
                        >
                          {category.name}
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                  
                  <Button
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="Guardando..."
                    onClick={savePreferences}
                    isDisabled={selectedInterests.length === 0}
                  >
                    Guardar preferencias
                  </Button>

                  <DeleteAccount 
                    auth={auth}
                  >
                  </DeleteAccount>
                </Box>
          
              )}
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Profile;