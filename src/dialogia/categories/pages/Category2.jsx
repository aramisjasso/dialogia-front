import React, { useState } from "react";
import { 
  Box, 
  Heading, 
  Text, 
  Image, 
  Flex, 
  Button, 
  Avatar, 
  ChakraProvider 
} from "@chakra-ui/react";
import { FaEye, FaCommentAlt } from "react-icons/fa";

const posts = [
  {
    id: 1,
    user: "Mark Wayne",
    date: "13/02/2024",
    text: "Nadie en realidad tiene el control sobre sus decisiones",
    avatar: "https://cdn-icons-png.flaticon.com/512/10337/10337609.png",
    views: 193,
    favor: 39,
    against: 32,
  },
  {
    id: 2,
    user: "Sasha Smith",
    date: "13/02/2024",
    text: "La consciencia humana está evolucionando colectivamente",
    avatar: "https://cdn-icons-png.flaticon.com/512/10337/10337609.png",
    views: 323,
    favor: 22,
    against: 13,
  },
];

const Category = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeButton, setActiveButton] = useState("activos");

  // Lista de botones a mostrar
  const buttons = ["activos", "recientes", "populares", "antiguos"];

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="lg" // Esquinas redondeadas
      boxShadow="md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cursor="pointer"
      mb={6}
      m={8}
    >
      {/* Imagen de la categoría */}
      <Image
        src="https://images.ecestaticos.com/YWOXT_EZ1_zgJzlO_Oc955aHT9g=/0x0:2145x1398/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F77a%2Fa2c%2Fc80%2F77aa2cc80d18747df1cfcbc1ba70eccc.jpg"
        alt="watafak"
        maxH="70vh"
        objectFit="cover"
        width="100%"
        height="auto"
      />

      {/* Contenedor superior para nombre y descripción */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        color="white"
        p={4}
      >
        <Heading size="lg">Hola</Heading>
        <Text fontSize="sm">Esta es una descripcion</Text>
      </Box>

      {/* Contenedor inferior para los botones */}
      <Flex
        position="absolute"
        bottom="0"
        left="50%"
        transform="translateX(-50%)"
        justify="center"
        bg="rgba(128,128,128,0.5)"
        align="center"
        borderRadius="full"
        mb={4}
        width="fit-content"
      >
        {buttons.map((btn, index) => (
          <Button
            key={btn}
            bg={activeButton === btn ? "gray.700" : "transparent"}
            color="white"
            _hover={{ bg: "gray.500" }}
            onClick={() => setActiveButton(btn)}
            borderRadius={index === 0 || index === buttons.length - 1 ? "full" : 0}
          >
            {btn.toUpperCase()}
          </Button>
        ))}
      </Flex>

      {/* Sección de Post List */}
      <Box mt={4} p={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Publicaciones activas
          </Text>
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
                <Text fontSize="sm" color="gray.500">
                  {post.date}
                </Text>
                <Text fontWeight="bold" mt={1}>
                  {post.text}
                </Text>
              </Box>
              <Flex align="center" color="gray.600">
                {/* Render the eye icon directly */}
                <FaEye style={{ marginRight: 4 }} />
                <Text>{post.views}</Text>
              </Flex>
            </Flex>
            <Flex mt={2} justify="space-between" color="gray.600">
              <Flex align="center">
                <FaCommentAlt style={{ marginRight: 4, color: "blue" }} />
                <Text>{post.favor} respuestas a favor</Text>
              </Flex>
              <Flex align="center">
                <FaCommentAlt style={{ marginRight: 4, color: "red" }} />
                <Text>{post.against} respuestas en contra</Text>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <ChakraProvider>
      <Category />
    </ChakraProvider>
  );
};

export default App;
