import { useState, useEffect } from 'react';
import { Heading, Text, Box, Flex, Image, useBreakpointValue, Spinner } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

const Ranking = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    const fetchRanking = async () => {
      try {
        const response = await fetch('http://localhost:3020/api/v1/user/ranking?global=false');
        if (!response.ok) {
          throw new Error('Error al obtener el ranking');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

    if (loading) {
     return (
       <Box textAlign="center" mt={10}>
         <Spinner size="xl" />
       </Box>
     );
   }

  if (error) {
    return (
      <Text textAlign="center" color="red.500">
        Error: {error}
      </Text>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="2xl" textAlign="center" mb={4} fontWeight="bold">
        Ranking
      </Heading>

      {users.length === 0 ? (
        <Text textAlign="center" fontStyle="italic" color="gray.500">
          No hay usuarios en el ranking
        </Text>
      ) : (
        <Box maxW="600px" mx="auto" align="center" pl="8%">
          {users.map((user) => (
            <Flex 
              key={user.id} 
              align="center" 
              p={3} 
              mb={2} 
              position="relative" 
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
            >
              <Image
                src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                w={imageSize}
                minW="60px"
                objectFit="contain"
                mr={4}
              />

              <Box>
                <Text 
                  fontSize="xl" 
                  fontWeight="bold" 
                  color="black"
                >
                  {user.username}
                </Text>
                
                <Flex mt={1}>
                  <Text 
                    fontSize="md" 
                    fontWeight="bold" 
                    color="#878787" 
                    mr={4}
                  >
                    ★ {user.classification}
                  </Text>
                  <Text 
                    fontSize="md" 
                    fontWeight="bold" 
                    color="#535353"
                  >
                    #{user.rank}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Box>
      )}
        <Text 
          color="#979797" 
          textDecoration="underline" 
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          cursor="pointer"
          onClick={() => navigate('/ranking')}
        >
          Ver más
        </Text>
    </Box>
  );
};

export default Ranking;