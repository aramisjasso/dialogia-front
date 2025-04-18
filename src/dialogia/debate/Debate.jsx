import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Flex, Link, Badge, Image } from '@chakra-ui/react';
import axios from 'axios';
import { FaEye, FaBell, FaUser } from "react-icons/fa";
import ChoosePosition from './ChoosePosition';
import { useAuth } from '../../contexts/hooks/useAuth';
import Comments from './Comments';
import BestComment from './BestComment';

const Debate = () => {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/debates/${id}`);
        setDebate(response.data);
        console.log(response.data.bestArgument);

        if (response.data && currentUser) {
          const initialPosition = 
            response.data.peopleInFavor.includes(currentUser.username) ? "InFavor" :
            response.data.peopleAgaist.includes(currentUser.username) ? "Agaist" :
            null;
          setUserPosition(initialPosition);
        }

      } catch (error) {
        console.error('Error fetching debate:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDebate();
  }, [id, currentUser]);

  const handlePositionChange = (newPosition) => {
    setUserPosition(newPosition);
  };

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
    <Box  maxW="100vw" mx="auto" p={6} position={"relative"} overflowX="hidden"> 

    <Box maxW="auto" mx="auto" p={6} borderWidth="1px" mb={6}
      borderRadius="3xl" position={"relative"}>

      {/* Sección superior */}
      <Flex justify="space-between" align="flex-start" mb={6}>
        {/* Columna izquierda (Usuario) */}
        <Box width="80px" textAlign="center">
          <Flex direction="column" align="center">
            <Image
              src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
              maxH="100px"
              maxW="100px"
              objectFit="cover"
              />
            {/* <FaUser size={64} color="#727272" /> */}

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
          <Image src={debate.image}/>
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
      {debate.bestArgument && (
        <BestComment 
          comment={debate.bestArgument} 
          debateId={id} 
        />
      )}
      <ChoosePosition
        isCreator={isCreator}
        initialUserVoted={userPosition !== null}
        initialPosition={userPosition}
        onPositionChange={handlePositionChange}
        peopleInFavor={debate.peopleInFavor || []}
        peopleAgaist={debate.peopleAgaist || []}
        comments={debate.comments || []}
        username={currentUser?.username}
        id = {id}
      />
      <Comments/>
      {userPosition !== null && ( 
        <Box
          position="absolute"
          top={1}
          right={0}
          transform="translateX(10%)"
          zIndex={1}
        >
          <Badge 
            bg={userPosition === "InFavor" ? "#00A76C" : "#C60000"} 
            color="white"
            variant="solid"
            fontSize="lg"
            pl={0}
            py={2.5}
            minWidth="200px"
            display="inline-flex" 
            justifyContent="center"
            borderRadius="full"
            boxShadow="md"
          >
            {userPosition === "InFavor" ? "A FAVOR" : "EN CONTRA"}
          </Badge>
        </Box>
      )}
    </Box>
  );
};

export default Debate;