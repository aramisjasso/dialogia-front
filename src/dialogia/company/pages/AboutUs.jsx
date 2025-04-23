import React from "react";
import { Box, Flex, Heading, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <Flex
      direction={{ base: "column", md: "row" }} 
      minH="100vh"
      gap={8}
    >

      <Box flex={{ md: "3" }} width={{ base: "100%", md: "60%" }} px={{ base: 6, md: 16 }}>
        <Box textAlign="center">
          <Image
            src="LOGO_ORIGINAL.png"
            alt="Dialogia"
            boxSize={{ base: "250px", md: "400px" }}
            mx="auto"
            objectFit="contain"
            mb={0}
          />
        </Box>

        <Text fontSize="sm" color="#444444" mb={1} fontWeight="bold">
          López, Miguel Ángel
        </Text>

        <Heading size="3xl" mb={6} color="#444444" fontWeight="bold">
          La Plataforma que Redefine la Discusión Pública
        </Heading>

        <Text fontSize="lg" mb={4} color="#676767" lineHeight="tall">
          Entendemos que el debate es fundamental para la democracia y el progreso social. Por ello, nuestra plataforma está comprometida con la libertad de expresión, siempre equilibrada con el respeto hacia todas las opiniones. Creemos que cada voz cuenta y que, a través del diálogo, se pueden descubrir soluciones innovadoras a los desafíos contemporáneos.
        </Text>

        <Text fontSize="lg" mb={8} color="#676767" lineHeight="tall">
          Te invitamos a formar parte de esta nueva era en la que el intercambio de ideas se convierte en el motor de cambio. Descubre un espacio donde la diversidad de pensamientos se celebra y cada discusión es una oportunidad para aprender, crecer y transformar la realidad.
        </Text>

        <Button
          bg="black"
          color="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="black"
          size="lg"
          w="fit-content"
          alignSelf="center"
          _hover={{ bg: "gray.700" }}
          onClick={() => navigate("/")}
        >
          VOLVER AL INICIO
        </Button>
      </Box>

      <Box flex={{ md: "2" }} width={{ base: "100%", md: "40%" }}>
        <Image
          src="aboutus.png"
          alt="Debate público"
          objectFit="cover"
          width="100%"
          height="100%"
          minH={{ base: "300px", md: "auto" }}
        />
      </Box>
    </Flex>
  );
};

export default AboutUs;