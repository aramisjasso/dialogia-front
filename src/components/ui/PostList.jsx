import React from "react";
import { Box, Text, Avatar, Flex, Button, Icon } from "@chakra-ui/react";
import { FaEye, FaCommentAlt } from "react-icons/fa";

const posts = [
  {
    id: 1,
    user: "Mark Wayne",
    date: "13/02/2024",
    text: "Nadie en realidad tiene el control sobre sus decisiones",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    views: 193,
    favor: 39,
    against: 32,
  },
  {
    id: 2,
    user: "Sasha Smith",
    date: "13/02/2024",
    text: "La consciencia humana está evolucionando colectivamente",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    views: 323,
    favor: 22,
    against: 13,
  },
];

const PostList = () => {
  return (
    <Box mt={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Publicaciones activas</Text>
        <Text color="gray.500">5024 resultados</Text>
        <Button bg="black" color="white" borderRadius="md" _hover={{ bg: "gray.700" }}>
          Agregar una publicación
        </Button>
      </Flex>

      {posts.map((post) => (
        <Box key={post.id} bg="gray.100" p={4} borderRadius="md" mb={3}>
          <Flex align="center">
            <Avatar src={post.avatar} mr={3} />
            <Box flex="1">
              <Text fontWeight="bold">{post.user}</Text>
              <Text fontSize="sm" color="gray.500">{post.date}</Text>
              <Text fontWeight="bold" mt={1}>{post.text}</Text>
            </Box>
            <Flex align="center" color="gray.600">
              <Icon as={FaEye} mr={1} />
              <Text>{post.views}</Text>
            </Flex>
          </Flex>
          <Flex mt={2} justify="space-between" color="gray.600">
            <Flex align="center">
              <Icon as={FaCommentAlt} color="blue.500" mr={1} />
              <Text>{post.favor} respuestas a favor</Text>
            </Flex>
            <Flex align="center">
              <Icon as={FaCommentAlt} color="red.500" mr={1} />
              <Text>{post.against} respuestas en contra</Text>
            </Flex>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};

export default PostList;
