// src/dialogia/profile/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from '../../../contexts/hooks/useAuth';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Avatar, 
  Button, 
  VStack,
  Icon,
  Grid, 
  GridItem,
  HStack, 
  Image,
  Wrap, 
  WrapItem,
  Center
  
} from "@chakra-ui/react";
import { auth } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster";
import {
    useColorModeValue,
  } from "../../../components/ui/color-mode"
import DeleteAccount from "./DeleteAccount";
import CensorshipToggle from "../components/CensorshipToggle";
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from "react-router-dom";
import { FaLockOpen as UnlockIcon, FaLock as LockIcon, FaStar as StarIcon } from 'react-icons/fa';

// importar componente de usuario
import UserProfile from "../components/UserProfile";

const Profile = () => {

    // Array plano de definiciones
const BADGE_DEFINITIONS = [
  // Insignias por creación de debates
  { badgeId: "create1",    badgeName: "Iniciador de Ideas",     description: "Creaste tu primer debate.",          xp: 5 },
  { badgeId: "create5",   badgeName: "Generador de Contenidos",description: "Has creado 5 debates.",              xp: 6 },
  { badgeId: "create10",   badgeName: "Foro Activo",            description: "Creaste 10 debates.",                 xp: 7 },
  { badgeId: "create20",  badgeName: "Voz Influyente",         description: "Creaste 20 debates.",                xp: 8 },
  // Insignias por participación en votos
  { badgeId: "vote1",      badgeName: "Voto Responsable",      description: "Emitiste tu primera votación.",        xp: 5 },
  { badgeId: "vote10",    badgeName: "Crítico Consistente",   description: "Has votado 10 veces en debates.",     xp: 6 },
  { badgeId: "vote50",    badgeName: "Balance Justo",         description: "Llegaste a 50 votos en debates.",     xp: 7 },
  { badgeId: "vote100",   badgeName: "Maestro del Voto",      description: "Has votado 100 veces.",              xp: 8 },
  // Insignias por comentarios y respuestas
  { badgeId: "comment1",   badgeName: "Primer Comentario",    description: "Publicaste tu primer comentario.",     xp: 5 },
  { badgeId: "comment10",  badgeName: "Conversador Habitual", description: "Dejas 10 comentarios.",                xp: 6 },
  { badgeId: "reply10",    badgeName: "Dialoguista",          description: "Respondiste a 10 comentarios.",         xp: 7 },
  { badgeId: "reply20",   badgeName: "Interlocutor Experimentado", description: "Respondiste a 20 comentarios.", xp: 8 },
  // Insignias por ‘likes’ y ‘dislikes’
  { badgeId: "react1",     badgeName: "Opinión Personal",     description: "Diste tu primer like o dislike.",     xp: 5 },
  { badgeId: "react10",   badgeName: "Apoyo Firme",          description: "Has otorgado 10 reacciones.",         xp: 6 },
  { badgeId: "react20",   badgeName: "Pulseador Ávido",      description: "Llegaste a 20 reacciones.",           xp: 7 },
  // Insignias temáticas por categorías
  { badgeId: "catFilosofia",  badgeName: "Filósofo",           description: "Publicaste 5 debates en Filosofía.", xp: 9 },
  { badgeId: "catReligion",   badgeName: "Teólogo",            description: "Publicaste 5 debates en Religión.",  xp: 9 },
  { badgeId: "catCiencia",    badgeName: "Investigador",       description: "Publicaste 5 debates en Ciencia.",   xp: 9 },
  { badgeId: "catDeportes",   badgeName: "Campeón Deportivo",  description: "Publicaste 5 debates en Deportes.",  xp: 9 },
  { badgeId: "catCulturaPop", badgeName: "Crítico de Cultura", description: "Publicaste 5 debates en Cultura Pop.", xp: 9},
  { badgeId: "catHistoria",   badgeName: "Cronista",           description: "Publicaste 5 debates en Historia.",  xp: 9},
  { badgeId: "catEconomia",   badgeName: "Economista",         description: "Publicaste 5 debates en Economía.",  xp: 9 },
  { badgeId: "catSocial",     badgeName: "Activista Social",   description: "Publicaste 5 debates en Social.",    xp: 9 },
  { badgeId: "catTecnologia", badgeName: "Tecno-visionario",   description: "Publicaste 5 debates en Tecnología.",xp: 9 },
  { badgeId: "catPolitica",   badgeName: "Político Digital",   description: "Publicaste 5 debates en Política.",  xp: 9 },
];

  const {currentUser, loading, error, refreshUser } = useAuth();//Contexto de usuario
  const [activeSection, setActiveSection] = useState("preferences");
  const [categories, setCategories] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [censorship, setCensorship] = useState(false);
  const [selectedId, setSelectedId] = useState(BADGE_DEFINITIONS[0].badgeId);
  const [userUnlockedBadges, setUserUnlockedBadges] = useState([]);
  const [userDebates, setUserDebates] = useState([]);
  const [allDebates, setAllDebates] = useState([]);
  const [comments, setComments] = useState([]); 
  const [currentBadge, setCurrentBadge] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activityTab, setActivityTab] = useState('debates');
  const selectedBadge = BADGE_DEFINITIONS.find(b => b.badgeId === selectedId);
  const bgLocked   = useColorModeValue('gray.200', 'gray.700');
  const bgUnlocked = useColorModeValue('white',    'gray.600');
  const bgSelected = useColorModeValue('blue.50',  'blue.700');
  const hoverBg    = useColorModeValue('blue.100','blue.600');
  const bgBox       = useColorModeValue('white',     'gray.700');
  const navigate = useNavigate();
  const activeBadgeName = currentUser.title;
  const getParentComment = (paidCommentId) => {
    return comments.find(c => c.idComment === paidCommentId);
  };

  const sortedBadgeDefs = BADGE_DEFINITIONS.slice().sort((a, b) => {
    const aUnlocked = userUnlockedBadges.includes(a.badgeId);
    const bUnlocked = userUnlockedBadges.includes(b.badgeId);
    // Si uno está desbloqueado y el otro no, el desbloqueado va primero
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
  
    // Si ambos comparten estado, mantén el orden original o ordénalos por nombre:
    return a.badgeName.localeCompare(b.badgeName);
  });

  // Obtener debates
  useEffect(() => {
    if (!currentUser?.username) return;

  const fetchAllDebates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/debates`);
      if (!res.ok) throw new Error('No pude cargar los debates');
      const all = await res.json();

      // 1) guarda todo en el estado
      setAllDebates(all);
      // 2) filtra tus debates de usuario sobre la variable local
      const userDs = all.filter(d => d.username === currentUser.username);
      setUserDebates(userDs);

      // 3) infiere el campo ID correcto (aquí uso `d.id`)
const commentsWithDebate = all
  .flatMap(d => {
    return (d.comments || []).map(c => {
      console.log(`Debate ${d.idDebate} → comment ${c.idComment}:`, c);
      return {
        ...c,
        debateId: d.idDebate
      };
    });
  })
  .filter(c => c.username === currentUser.username);

// Aquí añades el console.log para cada comentario ya filtrado:
commentsWithDebate.forEach(c => {
  console.log(`Filtered comment ${c.idComment} from debate ${c.debateId}:`, c);
});

setComments(commentsWithDebate);

      // para depurar:
      console.log('Primer debate:', all[0]);
      console.log('UserDebates:', userDs);
      console.log('CommentsWithDebate:', commentsWithDebate);
    } catch (err) {
      console.error(err);
      toaster.create({ description: err.message, type: 'error' });
    }
  };

  fetchAllDebates();
}, [currentUser?.username]);

  // Estadísticas
  const totalDebates = userDebates.length;

  // Para todos los debates (hechos)
  const commentsMade = allDebates.reduce(
    (acc, deb) => acc + deb.comments.filter(c => c.username === currentUser.username).length,
    0
  );
  const repliesMade = allDebates.reduce(
    (acc, deb) => acc + deb.comments.filter(c => c.username === currentUser.username && c.paidComment !== '').length,
    0
  );

  // Para debates propios (recibidos)
  const commentsReceived = userDebates.reduce(
    (acc, deb) => acc + deb.comments.filter(c => c.username !== currentUser.username).length,
    0
  );
  const repliesReceived = userDebates.reduce(
    (acc, deb) => acc + deb.comments.filter(c => c.paidComment !== '' && c.username !== currentUser.username).length,
    0
  );

  // Likes y dislikes recibidos sobre debates propios
  const totalLikesReceived = userDebates.reduce(
    (acc, deb) => acc + (deb.popularity || 0),
    0
  );
  const totalDislikesReceived = userDebates.reduce(
    (acc, deb) => acc + (deb.peopleAgaist?.length || 0),
    0
  );
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
        setCensorship(currentUser.censorship);
        setSelectedInterests(currentUser.interests || []);
        const unlocked = (currentUser.insignias || []).map(ins => ins.badgeId);
        setUserUnlockedBadges(unlocked);
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

  // Carga las notificaciones una sola vez
useEffect(() => {
  if (!currentUser?.username) return;

  const fetchNotifications = async () => {
    try {
      // Usa `username` (o el campo que tengas) en lugar de `toUser`
      const q = query(
        collection(db, 'notifications'),
        where('username', '==', currentUser.username)
      );
      const snap = await getDocs(q);
      const notifs = snap.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => {
          // Ordena localmente descendente por fecha
          const ta = a.datareg.toDate();
          const tb = b.datareg.toDate();
          return tb - ta;
        })
      setNotifications(notifs);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      toaster.create({ description: err.message, type: 'error' });
    }
  };

  fetchNotifications();
}, [currentUser?.username]);

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
      // const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${currentUser.uid}/interests`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interests: selectedInterests }),
        }
      );
      await refreshUser();
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

  const onApplyBadge = async (badgeId) => {
    const selected = BADGE_DEFINITIONS.find(b => b.badgeId === badgeId);
    if (!selected) return;
  
    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');
      const token = await user.getIdToken();
  
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.uid}/title`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title: selected.badgeName })
        }
      );
  
      if (!res.ok) throw new Error('Error al aplicar insignia');
  
      toaster.create({ description: 'Insignia aplicada correctamente', type: 'success' });
      await refreshUser();
      console.log("Insignia actual: ", currentUser.title);
      // Opcional: actualizar tu estado local para reflejar el nuevo title
      // p.ej. setUserTitle(selected.badgeName);
    } catch (err) {
      console.error(err);
      toaster.create({ description: err.message, type: 'error' });
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
              <Avatar.Root style={{ width: 150, height: 150, borderRadius: '9999px', overflow: 'hidden' }}>
                <Avatar.Fallback delayMs={600}>{`A${currentUser?.id}`}</Avatar.Fallback>
                <Avatar.Image src={`/avatar_${currentUser?.avatarId || "1" }.jpg`} alt={`Avatar ${currentUser?.id}`} />
              </Avatar.Root>
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

                  <UserProfile  currentUser={currentUser} refreshUser={refreshUser}/>
                </Box>
              )}
              
              {activeSection === "badges" && (
                <Box>
                  <Heading size="lg" mb={6}>Insignias</Heading>
                  <Flex w="full" h="full" p={4}>
  {/* Columna Izquierda: Lista con scroll independiente */}
  <Box
    w="35%"
    h="70vh"               // altura al 60% del viewport
    overflowY="auto"       // scroll solo aquí
    pr={4}
  >
    <VStack spacing={1} align="stretch">
      <Heading size="md" mb={2}>Tus Insignias</Heading>
{sortedBadgeDefs.map(badge => {
  const unlocked   = userUnlockedBadges.includes(badge.badgeId);
  const isActive   = badge.badgeName === activeBadgeName;

  return (
    <HStack
      key={badge.badgeId}
      p={2}
      borderRadius="md"
      bg={
        isActive
          ? 'green.100'               // verde claro si es la activa
          : (unlocked ? bgUnlocked : bgLocked)
      }
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      onClick={() => setSelectedId(badge.badgeId)}  // sigue usando selectedId para el detalle
    >
      <Icon
        as={unlocked ? UnlockIcon : LockIcon}
        color={unlocked ? 'green.500' : 'gray.500'}
      />
      <Text flex="1" fontWeight={isActive ? 'semibold' : 'normal'}>
        {badge.badgeName}
      </Text>
    </HStack>
  );
})}
    </VStack>
  </Box>
  {/* Columna Derecha: Detalle centrado, altura 60vh */}
  {selectedBadge && (

<Flex
  flexBasis="30vw"   // ancho fijo de 20vw
  flexGrow={0}       // no crece más allá de flexBasis
  flexShrink={0}     // no se encoge
  h="60vh"
  p={1}
  borderRadius="md"
  bg={bgBox}
  shadow="md"
  direction="column"
  ml={"10vw"}
>
     
      {/* Contenedor para título con fondo verde */}
      <Box
        bg={userUnlockedBadges.includes(selectedBadge.badgeId) ? "green.50" : "gray.100"}
        px={4}
        w="100%"
        py={12}        
        alignContent={"middle"}
        borderRadius="md"
        mb={4}
      >
          <Heading
    size="2xl"
    color={userUnlockedBadges.includes(selectedBadge.badgeId)? "green.800" : "gray.600"}
    textAlign="center"
    display="inline-flex"      
    alignItems="center"       
    justifyContent="center"    
    gap={2}
    w="100%"                   
  >
          <StarIcon/>{selectedBadge.badgeName}
        </Heading>
      </Box>
      <Flex justifyContent={"space-between"} mx={10}>
      <Text fontSize="lg" color="gray.500" mb={2}>
      <Icon
              as={userUnlockedBadges.includes(selectedBadge.badgeId) ? UnlockIcon : LockIcon}
              color={userUnlockedBadges.includes(selectedBadge.badgeId) ? 'gray.500' : 'gray.500'}
      /> 
        {userUnlockedBadges.includes(selectedBadge.badgeId)
          ? '   Desbloqueada'
          : '   Bloqueada'}
      </Text>
      <HStack mb={6} fontSize="lg">
        <Text fontWeight="semibold">XP:</Text>
        <Text>{selectedBadge.xp}</Text>
      </HStack>
      </Flex>
      <Text mb={4} textAlign="center">
      • {selectedBadge.description}
      </Text>



<Button
    background={
    selectedBadge.badgeName === activeBadgeName
      ? 'blue.600'    // botón verde si esa insignia ya está activa
      : 'black'
  }
  isDisabled={!userUnlockedBadges.includes(selectedBadge.badgeId)}
  onClick={() => onApplyBadge(selectedBadge.badgeId)}
  isLoading={isSubmitting}
  loadingText="Aplicando..."
  w="60%"
  mx="auto"
  mt="10vh"
>
  {selectedBadge.badgeName === activeBadgeName
    ? 'Seleccionada'   // texto alternativo
    : 'Aplicar'
  }
</Button>
    </Flex>
  )}
    </Flex>
                </Box>
              )}
              
{activeSection === "activity" && (
<Flex>
  {/* Lista de debates en la mitad izquierda */}
  <Box flex={1} p={4}>
    <Heading size="lg" mb={6}>Actividad</Heading>

    
      {/* Botones de pestañas */}
      <HStack spacing={4} mb={6}>
        <Button
          variant={activityTab === 'debates' ? 'solid' : 'ghost'}
          onClick={() => setActivityTab('debates')}
        >
          Debates
        </Button>
        <Button
          variant={activityTab === 'comments' ? 'solid' : 'ghost'}
          onClick={() => setActivityTab('comments')}
        >
          Comentarios
        </Button>
        <Button
          variant={activityTab === 'notifications' ? 'solid' : 'ghost'}
          onClick={() => setActivityTab('notifications')}
        >
          Notificaciones
        </Button>
      </HStack>

    <Box
      h="60vh"
      overflowY="auto"
      pr={4}
      sx={{
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': { bg: 'gray.300', borderRadius: '3px' }
      }}
    >
            {activityTab === 'debates' && userDebates.map((debate, idx) => (
            <Box
              key={debate.idDebate}
              p={4}
              _hover={{ bg: 'gray.50' }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              mb={idx < userDebates.length - 1 ? 2 : 0}
              cursor="pointer"
                              onClick={() => navigate(`/debate/${debate.idDebate}`)}
            >
              <Flex align="center" mb={2}>
                <Box
                  display="inline-block"
                  border="1px solid"
                  borderColor="gray.200"
                  px={3}
                  py={1}
                  fontSize="sm"
                  fontWeight="500"
                >
                  {debate.category
                    .toLowerCase()
                    .split(' ')
                    .map(w => w[0].toUpperCase() + w.slice(1))
                    .join(' ')}
                </Box>
                <Text fontSize="sm" color="gray.500" ml={3}>
                  {new Date(debate.datareg).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </Flex>

              <Heading as="h3" size="md" mb={2}>
                {debate.nameDebate}
              </Heading>

              <Text mb={2} color="#A9A9A9" fontSize="md">
                {debate.argument}
              </Text>

            </Box>
          ))}

              {activityTab === 'comments' && (
                        allDebates.flatMap(d =>
          d.comments
            .filter(c => c.username === currentUser.username)
            .map(c => {
              const parentComment = c.paidComment
                ? getParentComment(c.paidComment)
                : null;
              return (
                <Box
                  key={c.idComment}
                  bg="gray.100"
                  p={4}
                  borderRadius="lg"
                  mb={4}
                  position="relative"
                  cursor="pointer"
                  onClick={() => navigate(`/debate/${d.idDebate}`)}  // Aquí navegamos al debate
                >
                  {/* Comentario padre */}
                  {parentComment && (
                    <Box
                      bg="gray.200"
                      p={2}
                      borderRadius="md"
                      mb={3}
                      borderLeft="4px solid"
                      borderColor={parentComment.position ? 'blue.500' : 'red.500'}
                    >
                      <Text fontSize="sm" fontWeight="bold">@{parentComment.username}</Text>
                      <Text noOfLines={1}>{parentComment.argument}</Text>
                      <Text fontSize="xs" color="gray.600">
                        {new Date(parentComment.datareg).toLocaleDateString('es-ES')}
                      </Text>
                      
                    </Box>
                  )}

                  <Flex align="flex-start">
              <Avatar.Root style={{ width: 60, height: 60, borderRadius: '9999px', overflow: 'hidden' }}>
                <Avatar.Fallback delayMs={600}>{`A${currentUser?.id}`}</Avatar.Fallback>
                <Avatar.Image src={`/avatar_${currentUser?.avatarId || "1" }.jpg`} alt={`Avatar ${currentUser?.id}`} />
              </Avatar.Root>
                    <Box flex="1" ml={2}>
                      <Flex align="center" mb={2}>
                        <Text fontWeight="bold">{c.username}</Text>
                        <Text fontSize="sm" color="gray.500" ml={2}>
                          {new Date(c.datareg).toLocaleDateString('es-ES')} {' '}
                          {new Date(c.datareg).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </Flex>
                      <Text>{c.argument}</Text>
                      {c.image && <Image src={c.image} mt={2} />}
                    </Box>
                  </Flex>
                </Box>
              );
            })
        )
      )}

    {activityTab === 'notifications' && (
      <Box>
        {notifications.length === 0 ? (
          <Text fontSize="sm" color="gray.500">
            No hay notificaciones
          </Text>
        ) : (
          notifications.map(n => (
            <Box
              key={n.id}
              p={3}
              borderBottom="1px solid #eee"
              mb={2}
            >
              <HStack justifyContent="space-between">
                <Text fontWeight="bold" fontSize="sm">
                  {n.message.split(' ')[0]}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {n.datareg?.toDate().toLocaleString() ?? ''}
                </Text>
              </HStack>
              <Text fontSize="sm">
                {n.message.replace(/^\S+/, '').trim()}
              </Text>
            </Box>
          ))
        )}
      </Box>
    )}
    </Box>
  </Box>

  {/* Estadísticas en la mitad derecha */}
  <Box flex={1} p={4} ml={8}>
    {/* Heading fuera del Box con bordes */}
    <Heading size="lg" mb={4}>Mis Estadísticas</Heading>

    {/* Caja con borde, sombra y estadísticas */}
    <Box
      border="1px solid gray.600"
      boxShadow="md"
      borderRadius="md"
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%" mb={30}>
        {/* Score (ocupa 2 columnas) */}
        <Box
          gridColumn="span 2"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={4}
        >
          <Box
            w={24}
            h={24}
            borderRadius="full"
            borderWidth={3}
            borderColor="green.400"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr={3}
          >
            <Text fontSize="3xl" fontWeight="bold">
              {Math.round(currentUser.activity.score)}
            </Text>
          </Box>
          <Text fontSize="3xl" fontWeight="700" color="gray.600">XP</Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="500">Debates creados</Text>
          <Text fontSize="2xl">{totalDebates}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="500">Comentarios realizados</Text>
          <Text fontSize="2xl">{commentsMade}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="500">Comentarios recibidos</Text>
          <Text fontSize="2xl">{commentsReceived}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="500">Replies realizados</Text>
          <Text fontSize="2xl">{repliesMade}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="500">Replies recibidos</Text>
          <Text fontSize="2xl">{repliesReceived}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="500">Likes recibidos</Text>
          <Text fontSize="2xl">{totalLikesReceived}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="500">Dislikes recibidos</Text>
          <Text fontSize="2xl">{totalDislikesReceived}</Text>
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="500">Insignias desbloqueadas</Text>
          <Text fontSize="2xl">{userUnlockedBadges.length}</Text>
        </Box>
      </Grid>
    </Box>
  </Box>
</Flex>

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
                  />
                  <CensorshipToggle censorshipValue={censorship} CensorshipChange= {setCensorship} currentUser={currentUser} refreshUser={refreshUser}/>
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