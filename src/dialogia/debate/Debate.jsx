import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Flex, Link } from '@chakra-ui/react';
import axios from 'axios';
import { FaEye, FaBell, FaUser } from "react-icons/fa";
import ChoosePosition from './ChoosePosition';
import { useAuth } from '../../contexts/hooks/useAuth';

const Debate = () => {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();

  // Calcula userPosition solo cuando debate y currentUser estén disponibles
  const userPosition = debate && currentUser 
    ? debate.peopleInFavor.includes(currentUser.username) 
      ? "InFavor" 
      : debate.peopleAgaist.includes(currentUser.username) 
        ? "Agaist" 
        : null
    : null;

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/debates/${id}`);
        setDebate(response.data);
      } catch (error) {
        console.error('Error fetching debate:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDebate();
  }, [id]);

  if (loading  || authLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!debate) return <Text>Debate no encontrado</Text>;

  const isCreator = currentUser && debate.username === currentUser.username; 
  //console.log(userPosition);

  // Función para detectar y formatear URLs
  const formatRefs = (refs) => {
    if (!refs || refs.length === 0) return <Text color="#676767">No hay referencias</Text>;
  
    return refs.map((ref, index) => {
      // Convertir a string por si acaso
      const refString = String(ref);
      const httpsIndex = refString.indexOf('https://');
      
      if (httpsIndex === -1) {
        // Si no contiene URL, mostrar todo en gris
        return (
          <Text key={index} color="#676767">
            {refString}
          </Text>
        );
      } else {
        // Dividir el texto en partes
        const beforeUrl = refString.substring(0, httpsIndex);
        const url = refString.substring(httpsIndex);
        
        return (
          <Text key={index}>
            {beforeUrl && (
              <Text as="span" color="#676767">
                {beforeUrl}
              </Text>
            )}
            <Link href={url} color="#006273" isExternal>
              {url}
            </Link>
          </Text>
        );
      }
    });
  };

  return (
    <Box maxW="auto" mx="auto" p={6} >
    <Box maxW="auto" mx="auto" p={6} borderWidth="1px" mb={6}
borderRadius="3xl" >
      {/* Sección superior */}
      <Flex justify="space-between" align="flex-start" mb={6}>
        {/* Columna izquierda (Usuario) */}
        <Box width="80px" textAlign="center">
          <Flex direction="column" align="center">
            <FaUser size={64} color="#727272" />
            <Text size="md" fontWeight="bold" mt={2}>
              {debate.username}
            </Text>
            <Text fontSize="xs" color="#727272" fontWeight="bold">
             ★ Crítico
            </Text>
          </Flex>
        </Box>

        {/* Columna derecha (Contenido principal) */}
        <Box flex={1} ml={6}>
          {/* Primera línea (Categoría, fecha, hora, iconos) */}
          <Flex justify="space-between" align="center" mb={4} >
            <Flex align="center">
              <Heading as="h1" size="3xl" textTransform="uppercase" fontWeight="bold" mr={6}>
              {debate.category.replace("id", "")}
              </Heading>
              <Text fontSize="md" color="#727272" mr={4} fontWeight="bold" mt={3}>
                {new Date(debate.datareg).toLocaleDateString('es-ES')}
              </Text>
              <Text fontSize="md" color="#727272" fontWeight="bold" mr={8} mt={3}>
                {new Date(debate.datareg).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }).toLowerCase()}
              </Text>
              <FaBell size={24} style={{ marginRight: "16px", color: "#727272" }} />
            </Flex>
            <Flex align="center">
              <Flex align="center">
                <FaEye size={24} style={{ marginRight: "4px", color: "#727272" }} />
                <Text fontSize="sm" color="#727272" ml={2}>0</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Título y argumento */}
          <Heading as="h2" size="xl" mb={4}>
            {debate.nameDebate}
          </Heading>
          <Text color="#676767" fontSize="md" mb={6}>
            {debate.argument}
          </Text>
        </Box>
      </Flex>

      <Box h="1px" bg="#8F8F8F" my={2} />

      {/* Referencias */}
      <Box>
        <Heading as="h3" size="md" color="#676767">
          Referencias
        </Heading>
        {formatRefs(debate.refs)}
      </Box>
      </Box>
      <ChoosePosition
        isCreator={isCreator}
        //isCreator = {false} //testear postura sin ser creador
        initialUserVoted={userPosition !== null}
        initialPosition={userPosition}
        peopleInFavor={debate.peopleInFavor || []}
        peopleAgaist={debate.peopleAgaist || []}
        comments={debate.comments || []}
        username={currentUser?.username}
        id = {id}
      />
    </Box>
  );
};

export default Debate;