import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  Avatar,
  Text,
  Grid,
} from '@chakra-ui/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

const OthersProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
    const [avatarId, setAvatarId] = useState('1');
    const [userTitle, setUserTitle] = useState('Novato');
  const [debates, setDebates] = useState([]);
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [activityTab, setActivityTab] = useState('debates');
  const [userScore, setUserScore] = useState(0);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const catSnap = await getDocs(collection(db, 'categories'));
      const catMap = {};
      catSnap.docs.forEach(doc => {
        const data = doc.data();
        catMap[doc.id] = data.name;
      });
      setCategoryMap(catMap);

      // Debates
      const debatesSnap = await getDocs(collection(db, 'debates'));
      const debatesData = debatesSnap.docs.map(doc => ({ idDebate: doc.id, ...doc.data() }));
      const userDebates = debatesData.filter(d => d.username === username);
      setDebates(userDebates);

      // Comments
    const userComments = debatesData
      .flatMap(d =>
        (d.comments || []).map(c => ({ ...c, debateId: d.idDebate }))
      )
      .filter(c => c.username === username);
    setComments(userComments);

      // Notifications
      const notifQ = query(collection(db, 'notifications'), where('username', '==', username));
      const notifSnap = await getDocs(notifQ);
      setNotifications(notifSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // User doc for badges, score
      const userQ = query(collection(db, 'users'), where('username', '==', username));
      const userSnap = await getDocs(userQ);
      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        setBadgeCount((userData.insignias || []).length);
        setUserScore(Math.round(userData.activity?.score) || 0);
        setUserTitle(userData.activity?.title || 'Novato');
      }
    };
    fetchData();
  }, [username]);
  useEffect(() => {
  const fetchUserAvatar = async () => {
    // 1) Creamos la consulta por username
    const userQ = query(
      collection(db, 'users'),
      where('username', '==', username)
    );
    // 2) Ejecutamos y comprobamos si hay resultados
    const userSnap = await getDocs(userQ);
    if (!userSnap.empty) {
      const userData = userSnap.docs[0].data();
      // 3) Guardamos avatarId (o un valor por defecto)
      setAvatarId(userData.avatarId ?? '1');
    }
  };

  fetchUserAvatar();
}, [username]);

  // Stats
  const totalDebates = debates.length;
  const commentsMade = comments.length;
  const repliesMade = comments.filter(c => c.paidComment).length;
  const commentsReceived = debates.reduce(
    (acc, d) => acc + (d.comments || []).filter(c => c.username !== username).length,
    0
  );
  const repliesReceived = debates.reduce(
    (acc, d) => acc + (d.comments || []).filter(c => c.paidComment && c.username !== username).length,
    0
  );
  const totalLikesReceived = debates.reduce((acc, d) => acc + (d.popularity || 0), 0);
  const totalDislikesReceived = debates.reduce((acc, d) => acc + (d.peopleAgainst?.length || 0), 0);

  return (
    <Box p={8} maxW="container.xl" mx="auto">
        
      <Heading mb={6} size="2xl">        <Avatar.Root
        style={{
          width: 60,
          height: 60,
          borderRadius: '9999px',
          overflow: 'hidden'
        }}
        mr={3}
        ml={3}
        position="relative"
        top={-2}
      >
        <Avatar.Image
          src={`/avatar_${avatarId}.jpg`}

        />
      </Avatar.Root> Actividad de <Text as="span" color="blue.600">{username}</Text>
      
        </Heading>
              {/* Divisor personalizado */}
              <Box
                height="1px"
                bg="gray.200"
                width="100%"
                mx="auto"
                mb={[6, 10, 10]}
              />
        
      <Flex>
        {/* Actividad */}
        <Box flex={1}>
          <HStack spacing={4} mb={4}>
            <Button width="47%" variant={activityTab === 'debates' ? 'solid' : 'ghost'} onClick={() => setActivityTab('debates')}>Debates</Button>
            <Button width="47%" variant={activityTab === 'comments' ? 'solid' : 'ghost'} onClick={() => setActivityTab('comments')}>Comentarios</Button>
          </HStack>
            <Box
            h="60vh"
            overflowY="scroll"      // cambia de 'auto' a 'scroll' para que siempre esté visible
            pr={4}
            sx={{
                '&::-webkit-scrollbar': {
                width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                bg: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                bg: 'gray.300',
                borderRadius: '3px',
                },
            }}
            >
            {activityTab === 'debates' && debates.map((debate, idx) => {
              const nameCat = categoryMap[debate.category] || debate.category;
              return (
                <Box
                  key={debate.idDebate}
                  p={4}
                  _hover={{ bg: 'gray.50' }}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  mb={idx < debates.length - 1 ? 2 : 0}
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
                      {nameCat}
                    </Box>
                    <Text fontSize="sm" color="gray.500" ml={3}>
                      {debate.datareg.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                  </Flex>

                  <Heading as="h3" size="md" mb={2}>{debate.nameDebate}</Heading>

                  <Text mb={2} color="#A9A9A9" fontSize="md">{debate.argument}</Text>

                </Box>
              );
            })}

            {/* Comentarios y notificaciones siguen igual */}
            {activityTab === 'comments' && comments.map(c => (
                    <Box
        key={c.idComment}
        p={4}
        bg="gray.100"
        borderRadius="md"
        mb={3}
        cursor="pointer"
        _hover={{ bg: 'gray.200' }}  
        onClick={() => navigate(`/debate/${c.debateId}`)}  
      >

                <Flex align="center" mb={2}>
                          <Avatar.Root
        style={{
          width: 60,
          height: 60,
          borderRadius: '9999px',
          overflow: 'hidden'
        }}
        mr={3}
        mt={2}
      >
        <Avatar.Fallback delayMs={600}>
          {`A${c.username.charAt(0).toUpperCase()}`}
        </Avatar.Fallback>
        <Avatar.Image
          src={`/avatar_${avatarId}.jpg`}
          alt={`Avatar de ${c.username}`}
        />
      </Avatar.Root>
                    <Box>
                        <Flex>
                            <Text fontWeight="bold">{c.username}</Text>
                  <Text fontSize="sm" color="gray.500" ml={2}>{new Date(c.datareg).toLocaleDateString('es-ES')}</Text>
                        </Flex>
                        <Text>{c.argument}</Text>
                    </Box>
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Estadísticas */}
        <Box flex={1} ml={8} p={4} >
          <Heading size="md" mb={4}>Estadísticas</Heading>
          <Box       border="1px solid gray.600"
      boxShadow="md"
      borderRadius="md"
      p={4}
      pb={20}
      flexDirection="column">
          {/* XP */}
          <Flex align="center" justify="center" mb={6} pb={6}>
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
              <Text fontSize="3xl" fontWeight="bold">{userScore}</Text>
            </Box>
            <Text fontSize="3xl" fontWeight="700" color="gray.600">XP</Text>
          </Flex>

          <Grid templateColumns="repeat(2, 1fr)" gap={4} pl={4}>
            <Box>
              <Text fontSize="sm">Debates creados</Text>
              <Text fontSize="2xl">{totalDebates}</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Comentarios realizados</Text>
              <Text fontSize="2xl">{commentsMade}</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Replies realizados</Text>
              <Text fontSize="2xl">{repliesMade}</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Comentarios recibidos</Text>
              <Text fontSize="2xl">{commentsReceived}</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Replies recibidos</Text>
              <Text fontSize="2xl">{repliesReceived}</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Likes recibidos</Text>
              <Text fontSize="2xl">{totalLikesReceived}</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Dislikes recibidos</Text>
              <Text fontSize="2xl">{totalDislikesReceived}</Text>
            </Box>
            <Box>
              <Text fontSize="sm">Insignias desbloqueadas</Text>
              <Text fontSize="2xl">{badgeCount}</Text>
            </Box>
          </Grid>
          </Box>  
        </Box>
      </Flex>
    </Box>
  );
};

export default OthersProfile;
