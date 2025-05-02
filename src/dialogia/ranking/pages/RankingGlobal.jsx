import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  Badge,
  Stack,
  useBreakpointValue,
  Image
} from "@chakra-ui/react";
import CategoriesBar from "../../home/components/CategoriesBar";
import axios from "axios";

const RankingGlobal = ({ categories }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  const imageSize = useBreakpointValue({
      base: '15%',
      md: '10%',
      lg: '8%',
      xl: '5%'
    }, {
      fallback: 'md',
      minW: '100px'
    });

  // Usuario actual (simulado)
  const currentUser = {
    id: "8W4fn58QELWgMtmGMPz48hZOc2F2", // Usando un ID que existe en la respuesta
    username: "aramis",
    classification: "Crítico",
    activity: {
      interactions: {
        likes: 2,
        dislikes: 1,
        comments: 2
      },
      content: {
        created: 3,
        views: 12
      },
      score: 24.3
    },
    rank: 1
  };

  useEffect(() => {
    axios
      .get("http://localhost:3020/api/v1/user/ranking")
      .then((res) => {
        setRanking(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ranking:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <CategoriesBar categories={categories} />

      <Flex px={6} py={4} gap={6} direction={{ base: "column", md: "row" }}>
        <Box flex={3}>
          <Heading size="lg" mb={4}>
            Ranking Global
          </Heading>

          {loading ? (
            <Spinner />
          ) : (
            <Box>
              <Flex fontWeight="bold" px={2} py={2}>
                <Box flex="0.5" textAlign="center">Puesto</Box>
                <Box flex="2" textAlign="center">Perfil</Box>
                <Box flex="1" textAlign="center">Puntuación</Box>
                <Box flex="1" textAlign="center">Likes</Box>
                <Box flex="1" textAlign="center">Posts</Box>
                <Box flex="1" textAlign="center">Vistas</Box>
                <Box flex="1" textAlign="center">Comentarios</Box>
              </Flex>

            {ranking.map((user) => (
                <Flex key={user.id} px={2} py={2} align="center" cursor="pointer" _hover={{ bg: "gray.50" }}>
                  <Box flex="0.5" textAlign="center">#{user.rank}</Box>
                  <Box flex="2">
                    <Flex align="center" px={2} py={1}>
                      <Image
                        src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                        w="50px"
                        minW="50px"
                        objectFit="contain"
                        mr={4}
                      />
                
                      <Box>
                        <Text 
                          fontSize="lg" 
                          fontWeight="bold" 
                          color="black"
                        >
                          {user.username}
                        </Text>
                        
                        <Flex mt={1}>
                          <Text 
                            fontSize="sm" 
                            fontWeight="bold" 
                            color="#878787"
                          >
                            ★ {user.classification}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                  <Box flex="1" textAlign="center">{user.activity?.score?.toFixed(1) || 0}</Box>
                  <Box flex="1" textAlign="center">{user.activity?.interactions?.likes || 0}</Box>
                  <Box flex="1" textAlign="center">{user.activity?.content?.created || 0}</Box>
                  <Box flex="1" textAlign="center">{user.activity?.content?.views || 0}</Box>
                  <Box flex="1" textAlign="center">{user.activity?.interactions?.comments || 0}</Box>
                </Flex>
            ))}
            </Box>
          )}
        </Box>

        <Box
          flex={1}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="md"
        >
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            Tu Posición
          </Text>

          <Stack spacing={2} align="center">
          <Image
            src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
            w={imageSize}
            minW="200px"
            objectFit="contain"
            mr={4}
          />
            <Badge colorScheme="green" borderRadius="full" px={2} py={1}>
              #{currentUser.rank}
            </Badge>
            {/* <Avatar size="xl" name={currentUser.username} /> */}
            <Text fontWeight="semibold">{currentUser.username}</Text>
            <Text fontSize="sm" color="gray.500">
              {currentUser.classification}
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {currentUser.activity?.score?.toFixed(1)} puntos
            </Text>

            <Box w="100%" h="1px" bg="gray.200" my={2} />

            <Flex justify="space-between" w="full">
              <Box textAlign="center">
                <Text fontSize="sm">Publicaciones</Text>
                <Text fontWeight="bold">{currentUser.activity?.content?.created || 0}</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="sm">Comentarios</Text>
                <Text fontWeight="bold">{currentUser.activity?.interactions?.comments || 0}</Text>
              </Box>
            </Flex>

            <Flex justify="space-between" w="full">
              <Box textAlign="center">
                <Text fontSize="sm">Likes</Text>
                <Text fontWeight="bold">{currentUser.activity?.interactions?.likes || 0}</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="sm">Dislikes</Text>
                <Text fontWeight="bold">{currentUser.activity?.interactions?.dislikes || 0}</Text>
              </Box>
            </Flex>

            <Flex justify="space-between" w="full">
              <Box textAlign="center">
                <Text fontSize="sm">Vistas</Text>
                <Text fontWeight="bold">{currentUser.activity?.content?.views || 0}</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="sm">Puntuación</Text>
                <Text fontWeight="bold">{currentUser.activity?.score?.toFixed(1) || 0}</Text>
              </Box>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default RankingGlobal;