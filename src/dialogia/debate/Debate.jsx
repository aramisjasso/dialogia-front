import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Flex, Link, Badge, Image, Avatar} from '@chakra-ui/react';
import axios from 'axios';
import { FaEye, FaBell, FaUser } from "react-icons/fa";
import ChoosePosition from './ChoosePosition';
import { useAuth } from '../../contexts/hooks/useAuth';
import Comments from './Comments';
import BestComment from './BestComment';
import { toaster } from "../../components/ui/toaster";
import { auth } from "../../firebase/firebase";

const Debate = () => {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();
  const [censorship, setCensorship] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        setCensorship(currentUser.censorship);
        
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/debates/${id}?censored=${censorship}`,
          { username: currentUser.username });
        console.log(response.data)
        setDebate(response.data);
        console.log(response.data.bestArgument);
        
        if (response.data.followers && currentUser) {
         const isFollowing = response.data.followers.includes(currentUser.username);
         setFollowing(isFollowing);
        }
          
        if (response.data && currentUser) {
          const initialPosition = 
            response.data.peopleInFavor.includes(currentUser.username) ? "InFavor" :
            response.data.peopleAgaist.includes(currentUser.username) ? "Agaist" :
            null;
          setUserPosition(initialPosition);
        }
        if (debate && currentUser) {
          const isFollowing = Array.isArray(debate.followers) && debate.followers.includes(currentUser.username);
          setFollowing(isFollowing);
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

  const handleFollowToggle = async () => {
    setLoading(true)
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/debates/${id}/follow`
      const method = following ? 'DELETE' : 'POST'
      const payload = { username: currentUser.username }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        // parseamos el error si viene JSON
        const errorData = await response.json().catch(() => null)
        const message = errorData?.error || 'Error al actualizar seguimiento'
        throw new Error(message)
      }

      // todo OK: mostramos notificación
      toaster.create({
        title: following
          ? 'Has dejado de seguir el debate'
          : 'Ahora sigues el debate',
        status: following ? 'info' : 'success',
        duration: 2000,
      })

      // invertimos el estado
      setFollowing(prev => !prev)

    } catch (error) {
      console.error('Error al (de)seguir debate:', error)
      toaster.create({
        title: 'Error al actualizar seguimiento',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box  maxW="100vw" mx="auto" p={6} position={"relative"} overflowX="hidden"> 

    <Box maxW="auto" mx="auto" p={6} borderWidth="1px" mb={6}
      borderRadius="3xl" position={"relative"}>

      {/* Sección superior */}
      <Flex justify="space-between" align="flex-start" mb={6}>
        {/* Columna izquierda (Usuario) */}
        <Box width="80px" textAlign="center">
          <Flex direction="column" align="center">
            <Avatar.Root style={{ width: 100, height: 100, borderRadius: '9999px', overflow: 'hidden' }} mr={4}>
              <Avatar.Fallback delayMs={600}>{`A${debate.user?.id}`}</Avatar.Fallback>
              <Avatar.Image src={`/avatar_${debate.user?.avatarId || "1" }.jpg`} alt={`Avatar ${debate.user?.id}`} />
            </Avatar.Root>
            {/* <FaUser size={64} color="#727272" /> */}

            <Text size="md" fontWeight="bold" mt={2}>
              {debate?.username}
            </Text>
            <Text fontSize="xs" color="#727272" fontWeight="bold">
             ★ {debate.user?.title || "Sin título"}
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
              <FaBell
                  className={'bell-icon'}
                  onClick={handleFollowToggle}
                  style={{ color: following ? 'blue' : 'gray' }}
                  cursor='pointer'
              />

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
          {debate.image && (
            <Image
              src={debate.image}
              alt="Imagen del debate"
              objectFit="contain" // Mantiene la relación de aspecto y muestra la imagen completa
              maxW="100%"       // Ancho máximo del contenedor
              maxH={{           // Altura máxima responsiva
                base: "200px",  // Mobile
                md: "300px",    // Tablet
                lg: "400px"     // Desktop
              }}
              mx="auto"         // Centra la imagen horizontalmente
              my={4}            // Margen vertical
              borderRadius="md" // Bordes redondeados opcionales
              boxShadow="sm"    // Sombra ligera opcional
            />
          )}
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
          userPosition={userPosition === "InFavor" ? true : userPosition === "Against" ? false : null} 
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
      <Comments censored={censorship}/>
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