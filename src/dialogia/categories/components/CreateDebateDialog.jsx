import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Portal,
  Input,
  Textarea,
  Flex,
  Box, 
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { toaster } from "../../../components/ui/toaster";
import ImageUploader from "./ImageUploader";

// Constantes para los límites
const TITLE_MAX_LENGTH = 100;
const ARGUMENT_MAX_LENGTH = 2000;
const REFERENCE_MAX_LENGTH = 200;
const MAX_REFERENCES = 5;

const CreateDebateDialog = ({ triggerButton, categoryId = null }) => {
  const [title, setTitle] = useState("");
  const [argument, setArgument] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [references, setReferences] = useState([]);
  const [newReference, setNewReference] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const uploaderRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  
  
    
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

    if (!categoryId) {
      fetchCategories();
    }
  }, [categoryId]);

  const getUsername = () => {
    return localStorage.getItem("username") || "usuario-ejemplo";
  };

  const handleAddReference = () => {
    if (!newReference.trim()) return;
    
    if (references.length >= MAX_REFERENCES) {
      toaster.create({
        title: "Límite alcanzado",
        description: `Solo puedes agregar hasta ${MAX_REFERENCES} referencias`,
        status: "warning",
      });
      return;
    }
    
    if (newReference.length > REFERENCE_MAX_LENGTH) {
      toaster.create({
        title: "Referencia muy larga",
        description: `Las referencias no pueden exceder ${REFERENCE_MAX_LENGTH} caracteres`,
        status: "warning",
      });
      return;
    }
    
    setReferences([...references, newReference.trim()]);
    setNewReference("");
  };

  const handleRemoveReference = (index) => {
    const newRefs = references.filter((_, i) => i !== index);
    setReferences(newRefs);
  };

  const handleTitleChange = (e) => {
    if (e.target.value.length <= TITLE_MAX_LENGTH) {
      setTitle(e.target.value);
    }
  };

  const handleArgumentChange = (e) => {
    if (e.target.value.length <= ARGUMENT_MAX_LENGTH) {
      setArgument(e.target.value);
    }
  };

  const handleReferenceChange = (e) => {
    if (e.target.value.length <= REFERENCE_MAX_LENGTH) {
      setNewReference(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toaster.create({
        title: "Error",
        description: "Por favor, ingresa un título para el debate",
        status: "error",
        type: "error",
      });
      return;
    }

    if (!argument.trim()) {
      toaster.create({
        title: "Error",
        description: "Por favor, ingresa tu argumento",
        status: "error",
        type: "error",
      });
      return;
    }

    if (!selectedCategory && !categoryId) {
      toaster.create({
        title: "Error",
        description: "Por favor, selecciona una categoría",
        status: "error",
        type: "error",
      });
      return;
    }
    
    setIsLoading(true);
   
    let finalImage = image; // Valor por defecto (puede ser '')
    
    if (uploaderRef.current?.hasFile) {
      try {
        const fileData = await uploaderRef.current.uploadFile();
        finalImage = fileData.url; // Usamos una variable, no el estado
        setImage(finalImage); // Actualizamos el estado (pero no lo esperamos)
      } catch (error) {
        console.error('Error al subir:', error);
      }
    }

    try {
      const debateData = {
        nameDebate: title,
        argument: argument,
        category: selectedCategory || categoryId,
        username: getUsername(),
        refs: references,
        image: finalImage,
      };
      console.debug("DEBUG: Payload a enviar al API:", debateData);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/debates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(debateData),
      });

      if (!response.ok) {
        // Intentamos parsear el error como JSON para ver si es el caso específico
        const errorData = await response.json().catch(() => null);
        
        if (errorData?.error.includes("viola nuestras normas") ) {
          throw new Error(errorData.reason || errorData.error);
        } else {
          throw new Error("Error al publicar el debate");
        }
      }

      toaster.create({
        title: "Éxito",
        description: "Debate creado correctamente",
        status: "success",
        type: "success",
      });

      // Limpiar el formulario
      setTitle("");
      setArgument("");
      setReferences([]);
      if (!categoryId) setSelectedCategory(null);
      setIsOpen(false);
    } catch (error) {
      toaster.create({
        title: "Error al publicar",
        description: error.message,
        status: "error",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
      <span onClick={() => setIsOpen(true)}>
        {triggerButton}
      </span>
    </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="600px">
            <Dialog.Header>
              <Dialog.Title>Crear nuevo debate</Dialog.Title>
            </Dialog.Header>
            
              <CloseButton
                size="sm"
                position="absolute"
                right="2"
                top="2"
                onClick={() => setIsOpen(false)}
              />
            

            <Dialog.Body>
              <VStack spacing={4} align="stretch">
                {/* Título */}
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text>Título</Text>
                    <Text fontSize="sm" color="gray.500">
                      {title.length}/{TITLE_MAX_LENGTH}
                    </Text>
                  </Flex>
                  <Input
                    placeholder="Título del debate"
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={TITLE_MAX_LENGTH}
                  />
                </Box>

                {/* Argumento */}
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text>Argumento</Text>
                    <Text fontSize="sm" color="gray.500">
                      {argument.length}/{ARGUMENT_MAX_LENGTH}
                    </Text>
                  </Flex>
                  <Textarea
                    placeholder="Desarrolla tu argumento..."
                    value={argument}
                    onChange={handleArgumentChange}
                    rows={6}
                    maxLength={ARGUMENT_MAX_LENGTH}
                  />
                </Box>

                {/* Categorías */}
                {!categoryId && categories.length > 0 && (
                  <Box>
                    Categoría
                    <Flex wrap="wrap" gap={2}>
                      {categories.map((cat) => {
                        const categoryId = cat.id;
                        const isSelected = selectedCategory === categoryId;
                        
                        return (
                          <Button
                            key={categoryId}
                            size="sm"
                            variant={isSelected ? "solid" : "outline"}
                            colorScheme={isSelected ? "blue" : "gray"}
                            onClick={() => {
                              setSelectedCategory(isSelected ? null : categoryId);
                            }}
                          >
                            {cat.name}
                          </Button>
                        );
                      })}
                    </Flex>
                  </Box>
                )}

                {/* Imagen */}
                <Box>
                  Imagen (opcional)
                  <ImageUploader ref={uploaderRef} folderPath="debate"/>
                </Box>

                {/* Referencias */}
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text>Referencias (máx. {MAX_REFERENCES})</Text>
                    {references.length > 0 && (
                      <Text fontSize="sm" color="gray.500">
                        {references.length}/{MAX_REFERENCES}
                      </Text>
                    )}
                  </Flex>
                  <HStack>
                    <Input
                      placeholder={`Agregar referencia (máx. ${REFERENCE_MAX_LENGTH} caracteres)`}
                      value={newReference}
                      onChange={handleReferenceChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddReference();
                      }}
                      maxLength={REFERENCE_MAX_LENGTH}
                    />
                    <Button onClick={handleAddReference}>Agregar</Button>
                  </HStack>

                  {references.length > 0 && (
                    <Box mt={2} borderWidth="1px" p={2} borderRadius="md">
                      {references.map((ref, index) => (
                        <Flex
                          key={index}
                          justify="space-between"
                          align="center"
                          p={1}
                        >
                          <Text isTruncated maxW="80%">
                            {ref}
                          </Text>
                          <CloseButton
                            size="sm"
                            onClick={() => handleRemoveReference(index)}
                          />
                        </Flex>
                      ))}
                    </Box>
                  )}
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
            <Button
                variant="outline"
                mr={2}
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={isLoading}
              >
                Publicar debate
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CreateDebateDialog;