import { useEffect, useState } from "react";
import { Box, Heading, Text, Flex, Spinner, Stack, useBreakpointValue, Image, Avatar } from "@chakra-ui/react";
import CategoriesBar from "../../home/components/CategoriesBar";
import axios from "axios";
import { useAuth } from '../../../contexts/hooks/useAuth';

const RankingGlobal = ({ categories }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth();
  const currentUser = user.currentUser;

  const imageSize = useBreakpointValue({
    base: '15%',
    md: '10%',
    lg: '8%',
    xl: '5%'
  }, {
    fallback: 'md',
    minW: '100px'
  });

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/user/ranking')
      .then((res) => {
        setRanking(res.data);
        const currentUserRank = res.data.find(user =>
          user.uid === currentUser.uid ||
          user.username === currentUser.username
        );

        if (currentUserRank) {
          currentUser.rank = currentUserRank.rank;
          currentUser.title = currentUserRank.title;
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ranking:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <CategoriesBar showRankingButton={false} />

      <Flex px={6} py={4} gap={6} direction={{ base: "column", md: "row" }}>
        <Box flex={3}>
          <Heading as="h1" size="2xl" mb={6} fontWeight="bold">
            Ranking Global
          </Heading>
          {loading ? (
            <Spinner />
          ) : (
            <Box>
              <Flex color={"#878787"} px={2} py={2} position="sticky" top="0" zIndex="1">
                <Box flex="0.5" textAlign="center">Puesto</Box>
                <Box flex="2" textAlign="center">Perfil</Box>
                <Box flex="1" textAlign="center">Nivel</Box>
                <Box flex="1" textAlign="center">Puntuación</Box>
                <Box flex="1" textAlign="center">Likes</Box>
                <Box flex="1" textAlign="center">Posts</Box>
                <Box flex="1" textAlign="center">Vistas</Box>
                <Box flex="1" textAlign="center">Comentarios</Box>
              </Flex>

              <Box
                maxH="calc(100vh - 250px)"
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "3px",
                  },
                }}
              >
                {ranking.map((user) => (
                  <Flex fontWeight="bold" key={user.id} px={2} py={2} align="center" cursor="pointer" _hover={{ bg: "gray.50" }}>
                    <Box flex="0.5" textAlign="center" color={"#535353"} fontSize="xl">#{user.rank}</Box>
                    <Box flex="2">
                      <Flex align="center" px={2} py={1}>
                        <Avatar.Root style={{ width: 50, height: 50, borderRadius: '9999px', overflow: 'hidden' }} mr={4}>
                          <Avatar.Fallback delayMs={600}>{`A${user.id}`}</Avatar.Fallback>
                          <Avatar.Image src={`/avatar_${user?.avatarId || "1" }.jpg`} alt={`Avatar ${user.id}`} />
                        </Avatar.Root>

                        <Box>
                          <Text
                            fontSize="lg"
                            color="black"
                          >
                            {user.username}
                          </Text>

                          <Flex mt={1}>
                            <Text
                              fontSize="sm"
                              color="#878787"
                            >
                              ★ {user.title || 'Espectador'}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                    <Box flex="1" textAlign="center" color={"#878787"} fontSize="lg">
                      {user.activity?.score ? Math.floor(user.activity.score / 10) + 1 : 1}
                    </Box>
                    <Box flex="1" textAlign="center" color={"#878787"} fontSize="lg">{user.activity?.score?.toFixed(0) || 0} XP</Box>
                    <Box flex="1" textAlign="center" color={"#878787"} fontSize="lg">{user.activity?.interactions?.likes || 0}</Box>
                    <Box flex="1" textAlign="center" color={"#878787"} fontSize="lg">{user.activity?.content?.created || 0}</Box>
                    <Box flex="1" textAlign="center" color={"#878787"} fontSize="lg">{user.activity?.content?.views || 0}</Box>
                    <Box flex="1" textAlign="center" color={"#878787"} fontSize="lg">{user.activity?.interactions?.comments || 0}</Box>
                  </Flex>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box
          flex={1}
          position={{ base: "static", md: "sticky" }}
          top="100px"
          alignSelf="flex-start"
        >
          <Heading as="h1" size="2xl" mb={6} fontWeight="bold">
            Tu Posición
          </Heading>

          <Box
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.1)"
          >
            <Box
              position="absolute"
              bg="white"
              border="4px solid #14EC00"
              borderRadius="full"
              w="40px"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              fontSize="lg"
            >
              {currentUser.activity?.score ? Math.floor(currentUser.activity.score / 10) + 1 : 1}
            </Box>

            <Text
              position="absolute"
              right="20px"
              fontWeight="bold"
              fontSize="lg"
              color="black"
            >
              #{currentUser.rank}
            </Text>

            <Stack spacing={2} align="center">
                            <Avatar.Root style={{ width: 160, height: 160, borderRadius: '9999px', overflow: 'hidden' }} mr={4}>
                <Avatar.Fallback delayMs={600}>{`A${user.id}`}</Avatar.Fallback>
                <Avatar.Image src={`/avatar_${currentUser?.avatarId || "1" }.jpg`} alt={`Avatar ${user.id}`} />
              </Avatar.Root>
              {/* <Avatar size="xl" name={currentUser.username} /> */}
              <Text fontWeight="bold" fontSize="xl" color="#3D3D3D">{currentUser.username}</Text>
              <Flex alignItems="center">
              <Text fontWeight="bold" fontSize="xl" color="#7B7B7B" mr={1}>
                ★
              </Text>
              <Text fontWeight="bold" fontSize="md" color="#7B7B7B">
                {currentUser.title || 'Espectador'}
              </Text>
              </Flex>
              <Text fontSize="2xl" fontWeight="bold">
                {currentUser.activity?.score?.toFixed(0)} XP
              </Text>
            </Stack>

            <Box mt={8}>
              <Flex justify="space-between" mb={6}>
                <Box textAlign="center" flex={1}>
                  <Text fontSize="md" fontWeight="semibold" color="#3D3D3D">Publicaciones</Text>
                  <Text fontSize="2xl" fontWeight="bold">{currentUser.activity?.content?.created || 0}</Text>
                </Box>
                <Box textAlign="center" flex={1}>
                  <Text fontSize="md" fontWeight="semibold" color="#3D3D3D">Comentarios</Text>
                  <Text fontSize="2xl" fontWeight="bold">{currentUser.activity?.interactions?.comments || 0}</Text>
                </Box>
              </Flex>

              <Flex justify="space-between" mb={2}>
                <Box textAlign="center" flex={1} mb={6}>
                  <Text fontSize="md" fontWeight="semibold" color="#3D3D3D">Likes</Text>
                  <Text fontSize="2xl" fontWeight="bold">{currentUser.activity?.interactions?.likes || 0}</Text>
                </Box>
                <Box textAlign="center" flex={1}>
                  <Text fontSize="md" fontWeight="semibold" color="#3D3D3D">Dislikes</Text>
                  <Text fontSize="2xl" fontWeight="bold">{currentUser.activity?.interactions?.dislikes || 0}</Text>
                </Box>
              </Flex>

              <Flex justify="space-between">
                <Box textAlign="center" flex={1} mb={6}>
                  <Text fontSize="md" fontWeight="semibold" color="#3D3D3D">Vistas</Text>
                  <Text fontSize="2xl" fontWeight="bold">{currentUser.activity?.content?.views || 0}</Text>
                </Box>
                <Box textAlign="center" flex={1} mb={6}>
                  <Text fontSize="md" fontWeight="semibold" color="#3D3D3D">Insignias</Text>
                  <Text fontSize="2xl" fontWeight="bold">{currentUser.activity?.badges?.count || '0/0'}</Text>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default RankingGlobal;