import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

      <Box 
        maxW="100%" 
        mx="auto" 
        p={{ base: 4, md: 6 }} 
        borderWidth="1px" 
        mb={6}
        borderRadius="3xl" 
        position="relative"
        overflow="hidden"
      >

        {/* Sección superior - Reorganizada */}
        <Flex 
          direction="column"
          mb={6}
        >
          {/* Primera fila (iconos y metadatos) */}
          <Flex 
            justify="space-between" 
            align="center" 
            mb={4}
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 3, sm: 0 }}
          >
            {/* Categoría y fecha/hora */}
            <Flex 
              direction={{ base: "column", sm: "row" }}
              align={{ base: "flex-start", sm: "center" }}
              order={{ base: 2, sm: 1 }}
              width={{ base: "100%", sm: "auto" }}
            >
              <Heading 
                as="h1" 
                size={{ base: "xl", md: "3xl" }} 
                textTransform="uppercase" 
                fontWeight="bold" 
                mr={{ base: 0, sm: 6 }}
                mb={{ base: 2, sm: 0 }}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxWidth="100%"
              >
                {debate.category.replace("id", "")}
              </Heading>
              
              <Flex 
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
                gap={{ base: 1, sm: 4 }}
              >
                <Text fontSize={{ base: "sm", md: "md" }} color="#727272" fontWeight="bold">
                  {new Date(debate.datareg).toLocaleDateString('es-ES')}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color="#727272" fontWeight="bold">
                  {new Date(debate.datareg).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }).toLowerCase()}
                </Text>
              </Flex>
            </Flex>

            {/* Iconos (campana y ojo) */}
            <Flex 
              align="center" 
              justify="flex-end"
              width={{ base: "100%", sm: "auto" }}
              order={{ base: 1, sm: 2 }}
              gap={6}
            >
              <FaBell
                className={'bell-icon'}
                onClick={handleFollowToggle}
                style={{ 
                  color: following ? 'blue' : 'gray',
                  fontSize: "clamp(18px, 2vw, 24px)"
                }}
                cursor='pointer'
              />
              
              <Flex align="center">
                <FaEye style={{ 
                  color: "#727272", 
                  marginRight: "4px", 
                  fontSize: "clamp(18px, 2vw, 24px)"
                }} />
                <Text fontSize={{ base: "sm", md: "md" }} color="#727272">
                  {debate.popularity}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Segunda fila (usuario) - Ahora debajo de los iconos */}
          <Flex 
            justify="flex-start" 
            align="center"
            mb={4}
            gap={4}
            direction={{ base: "column", sm: "row" }}
          >
            <Avatar.Root style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '9999px', 
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <Avatar.Fallback delayMs={600}>{`A${debate.user?.id}`}</Avatar.Fallback>
              <Avatar.Image src={`/avatar_${debate.user?.avatarId || "1" }.jpg`} alt={`Avatar ${debate.user?.id}`} />
            </Avatar.Root>

            <Box textAlign={{ base: "center", sm: "left" }}>
              <Text 
                size="md" 
                fontWeight="bold" 
                cursor="pointer" 
                _hover={{ color: 'blue.600' }} 
                onClick={() => navigate(`/profile/${debate.username}`)}
              >
                {debate?.username}
              </Text>
              <Text fontSize="xs" color="#727272" fontWeight="bold">
                ★ {debate.user?.title || "Sin título"}
              </Text>
            </Box>
          </Flex>

          {/* Título y argumento */}
          <Box width="100%">
            <Heading 
              as="h2" 
              size={{ base: "lg", md: "xl" }} 
              mb={4}
              wordBreak="break-word"
            >
              {debate.nameDebate}
            </Heading>
            
            <Text 
              color="#676767" 
              fontSize={{ base: "sm", md: "md" }} 
              mb={6}
              wordBreak="break-word"
            >
              {debate.argument}
            </Text>
            
            {debate.image && (
              <Image
                src={debate.image}
                alt="Imagen del debate"
                objectFit="contain"
                maxW="100%"
                maxH={{
                  base: "200px",
                  md: "300px",
                  lg: "400px"
                }}
                mx="auto"
                my={4}
                borderRadius="md"
                boxShadow="sm"
              />
            )}
          </Box>
        </Flex>

        <Box h="1px" bg="#8F8F8F" my={2} />

        {/* Referencias */}
        <Box>
          <Heading as="h3" size={{ base: "sm", md: "md" }} color="#676767">
            Referencias
          </Heading>
          {formatRefs(debate.refs)}
        </Box>
      </Box>

      {debate.bestArgument && (
        <BestComment 
          comment={debate.bestArgument} 
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
            {userPosition === "InFavor" ? "A favor" : "En contra"}
          </Badge>
        </Box>
      )}
    </Box>
  );
};

export default Debate;