import React, { useRef } from "react";
import { Box, Flex, Heading, Text, Link } from "@chakra-ui/react";

const Policies = () => {
  const sectionsRef = useRef([]);

  const policies = [
    {
      id: "aceptacion",
      title: "Aceptación de Términos",
      content: "Al adentrarte en nuestra plataforma, te conviertes en partícipe de un proyecto que trasciende el mero intercambio de opiniones. Este espacio, concebido como un foro del saber y del diálogo, se rige por un conjunto de principios fundamentales que buscan no solo regular el uso, sino también fomentar una cultura del debate respetuoso y enriquecedor. Al utilizar nuestros servicios, aceptas voluntariamente estas directrices, convencido de que la libertad de expresión se ejerce mejor en un ambiente de responsabilidad y ética."
    },
    {
      id: "uso-responsable",
      title: "Uso Responsable y Respeto Mutuo", 
      content: "Promovemos un uso responsable del lenguaje, donde se privilegia el discurso fundamentado y la crítica constructiva. Invitamos a nuestros usuarios a abandonar posturas incendiarias y simplistas, optando en su lugar por un intercambio que celebre la diversidad de pensamientos y enriquezca el debate público. Así, rechazamos expresamente cualquier forma de expresión que incite al odio, la discriminación o la violencia, pues entendemos que la grandeza del diálogo reside en su capacidad para transformar la confrontación en un proceso de aprendizaje mutuo."
    },
    {
      id: "moderacion",
      title: "Moderación y Control de Contenidos",
      content: "Conscientes de que la calidad del debate depende en gran medida del entorno en que se desarrolla, hemos implementado un sistema de moderación activo y transparente. Nuestro equipo, comprometido con la salvaguarda de un ambiente sano, interviene de manera preventiva y correctiva para garantizar que cada intervención respete los estándares éticos y normativos establecidos. Las publicaciones que vulneren estos principios serán objeto de revisión, pudiendo ser editadas o retiradas para preservar la integridad del discurso. Este esfuerzo colectivo asegura que la plataforma se mantenga como un escenario en el que el intercambio de ideas se lleve a cabo de forma constructiva y enriquecedora."
    },
    {
      id: "privacidad",
      title: "Privacidad y Protección de Datos",
      content: "En Dialogia, entendemos que la confidencialidad y el manejo ético de la información son pilares de la confianza digital. Los datos personales que compartas (como correo electrónico o nombre de usuario) se gestionan bajo estrictos protocolos de seguridad, utilizándose únicamente para fines de autenticación, personalización de la experiencia y mejora continua de la plataforma. Nos comprometemos a no comercializar tu información ni cederla a terceros sin consentimiento explícito, salvo por requerimientos legales. Implementamos medidas técnicas avanzadas para proteger tu privacidad, pero recordamos que la responsabilidad compartida —como el uso de contraseñas robustas— es esencial en este ecosistema de diálogo seguro."
    },
    {
      id: "modificaciones",
      title: "Modificaciones a las Políticas",
      content: "Dialogia es un organismo en evolución, y estas políticas podrán actualizarse para reflejar nuevos consensos éticos, cambios normativos o innovaciones tecnológicas. Te notificaremos mediante un aviso destacado en la plataforma o a través de tu correo registrado cuando ocurran ajustes significativos. Tu uso continuado de los servicios tras dichas modificaciones constituirá aceptación tácita de las mismas. Fomentamos que revises periódicamente este apartado, pues la participación informada es la base de una comunidad consciente."
    },
    {
      id: "contacto",
      title: "Contacto y Soporte",
      content: "Creemos que el diálogo también debe extenderse a la relación entre la plataforma y sus usuarios. Para reportar contenidos inapropiados, resolver dudas sobre estas políticas o solicitar asistencia técnica, puedes contactar a nuestro equipo de soporte en  dialogiap@gmail.com. Nos comprometemos a responder en un plazo máximo de 48 horas, pues cada interrupción en tu experiencia de debate es una oportunidad perdida para el enriquecimiento colectivo."
    },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      {/* Encabezado */}
      <Heading size="4xl" mb={4} color={"#444444"} fontWeight="bold">
        Políticas de Uso y Privacidad
      </Heading>
      <Box h="1px" bg="#8F8F8F" my={2} />
    
      <Flex direction={{ base: "column", md: "row" }} gap={8} mt={8}>
        {/* Contenido principal con scroll */}
        <Box 
          flex="3" 
          pr={{ md: 8 }}
          overflowY="auto"
          maxH="calc(100vh - 200px)"
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
          {policies.map((section) => (
            <Box key={section.id} id={section.id} mb={12}>
              <Heading size="xl" mb={4} color="#444444" fontWeight="bold">
                {section.title}
              </Heading>
              <Text fontSize="lg" color="#676767">
                {section.content}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Tabla de contenidos */}
        <Box 
          flex="1"
          position={{ base: "static", md: "sticky" }}
          top="100px"
          alignSelf="flex-start"
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
          boxShadow="sm"
        >
          <Heading size="md" mb={4} color="3D3D3D">
            Tabla de contenidos
          </Heading>
          <Flex direction="column" gap={2} mb={4}>
            {policies.map((section) => (
              <Link
                key={section.id}
                color="#003EDC"
                onClick={() => scrollToSection(section.id)}
                _hover={{ textDecoration: "underline" }}
                cursor="pointer"
                mb={2}
              >
                {section.title}
              </Link>
            ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Policies;