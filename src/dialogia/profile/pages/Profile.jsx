// src/dialogia/profile/pages/Profile.jsx
import { Box, Heading } from "@chakra-ui/react";

const Profile = () => {
  return (
    <Box p={8} maxW="container.md" mx="auto">
      <Heading size="xl" mb={8} textAlign="center">
        Mi Perfil
      </Heading>
      
      {/* Contenido del perfil irá aquí */}
      <Box textAlign="center" py={10}>
        <Heading size="md" color="gray.500">
          Contenido del perfil en construcción...
        </Heading>
      </Box>
    </Box>
  );
};

export default Profile;