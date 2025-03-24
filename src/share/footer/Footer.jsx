// src/share/footer/Footer.jsx
import { Box, Text, Flex, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      bg="blackAlpha.900" // Fondo negro
      color="white" // Texto blanco
      py={6} // Padding vertical
      textAlign="center"
    >
      <Text fontSize="sm" color="gray.300">
        © 2025 Dialogia.
      </Text>
      <Flex mt={2} gap={4} justify="center">
        {/*<Link href="#" fontSize="sm" color="teal.500" _hover={{ color: "teal.300" }}>
          Términos y condiciones
        </Link>
        <Link href="#" fontSize="sm" color="teal.500" _hover={{ color: "teal.300" }}>
          Política de privacidad
        </Link>*/}
      </Flex>
    </Box>
  );
};

export default Footer;