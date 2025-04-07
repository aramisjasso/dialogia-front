// src/components/Layout.jsx
import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import NavTab from "./Navtab.jsx";
import Footer from "../../share/footer/Footer.jsx"; // Importa el Footer
const Layout = ({ children }) => {
  return (
    <Flex
      direction="column"
      minHeight="100vh" // Asegura que el Layout ocupe al menos el 100% de la altura de la pantalla
    >
      {/* NavTab en la parte superior */}
      <NavTab />

      {/* Contenido principal (crece para ocupar el espacio disponible) */}
      <Box flexGrow={1}>
        {children}
      </Box>

      {/* Footer (se coloca en la parte inferior) */}
      <Box mt="auto">
        <Footer />
      </Box>
    </Flex>
  );
};

export default Layout;