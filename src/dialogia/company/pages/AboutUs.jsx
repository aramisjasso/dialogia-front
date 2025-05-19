import React from "react";
import { Box, Flex, Heading, Text, Image, SimpleGrid, Avatar } from "@chakra-ui/react";

const AboutUs = () => {
  return (
    <Box bg="white">
      {/* Sección principal */}
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

          <Heading size="3xl" mb={6} color="#444444" fontWeight="bold" textAlign="center">
            La Plataforma que Redefine la Discusión Pública
          </Heading>

          <Text fontSize="md" mb={4} color="#676767" lineHeight="tall">
            Entendemos que el debate es fundamental para la democracia y el progreso social. Por ello, nuestra plataforma está comprometida con la libertad de expresión, siempre equilibrada con el respeto hacia todas las opiniones. Creemos que cada voz cuenta y que, a través del diálogo, se pueden descubrir soluciones innovadoras a los desafíos contemporáneos.
          </Text>

          <Text fontSize="md" mb={8} color="#676767" lineHeight="tall" mb={16}>
            Te invitamos a formar parte de esta nueva era en la que el intercambio de ideas se convierte en el motor de cambio. Descubre un espacio donde la diversidad de pensamientos se celebra y cada discusión es una oportunidad para aprender, crecer y transformar la realidad.
          </Text>

         {/* Sección del equipo */}
          <Box mb={16}>
            <Heading
              size="3xl"
              mb={6}
              color="#444444"
              fontWeight="bold"
              textAlign="center"
            >
              Conoce al equipo
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing={10}
              px={{ base: 4, md: 16 }}
            >
              {[
                { name: "Miguel López", src: "mi-gallo.png" },
                { name: "Aramis Jasso", src: "aramis.jpg" },
                { name: "Carlos Aguilar", src: "carlos.png" },
                { name: "Otmar Vargas", src: "otmar.png" },
              ].map((member, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={8}
                  m={2}
                  borderRadius="2xl"
                  boxShadow="lg"
                  textAlign="center"
                  _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
                >
                  <Avatar.Root
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "9999px",
                      overflow: "hidden",
                      margin: "0 auto",
                    }}
                  >
                    <Avatar.Fallback delayMs={600}>{member.name[0]}</Avatar.Fallback>
                    <Avatar.Image src={`/${member.src}`} alt={member.name} />
                  </Avatar.Root>

                  <Heading as="h3" size="lg" mt={4} mb={1} color="gray.700">
                    {member.name}
                  </Heading>
                  <Text fontSize="md" color="gray.500">
                    Full Stack Developer
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>

        <Box flex={{ md: "2" }} width={{ base: "100%", md: "40%" }}>
          <Image
            src="aboutus.jpg"
            alt="Debate público"
            objectFit="cover"
            width="100%"
            height="100%"
            minH={{ base: "300px", md: "auto" }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default AboutUs;
