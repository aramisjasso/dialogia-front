// src/dialogia/profile/components/ProfileSidebar.jsx
import React from 'react';
import { 
  Box, 
  VStack, 
  Avatar, 
  Text, 
  Button 
} from '@chakra-ui/react';

const ProfileSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <Box 
      w="250px" 
      bg="white" 
      borderRadius="lg" 
      p={4} 
      boxShadow="sm"
      position="sticky"
      top="84px"
      h="fit-content"
    >
      <VStack spacing={4} align="stretch">
        <VStack spacing={3} pb={4}>
          <Avatar size="xl" name="Nombre Usuario" src="" />
          <Text fontWeight="bold" fontSize="lg">Username</Text>
        </VStack>
        
        {/* Divider alternativo */}
        <Box borderTop="1px" borderColor="gray.200" my={2} />
        
        <Button 
          variant={activeSection === "profile" ? "solid" : "ghost"}
          justifyContent="flex-start"
          onClick={() => setActiveSection("profile")}
        >
          Perfil
        </Button>
        
        <Button 
          variant={activeSection === "badges" ? "solid" : "ghost"}
          justifyContent="flex-start"
          onClick={() => setActiveSection("badges")}
        >
          Insignias
        </Button>
        
        <Button 
          variant={activeSection === "activity" ? "solid" : "ghost"}
          justifyContent="flex-start"
          onClick={() => setActiveSection("activity")}
        >
          Actividad
        </Button>
        
        <Button 
          variant={activeSection === "preferences" ? "solid" : "ghost"}
          justifyContent="flex-start"
          onClick={() => setActiveSection("preferences")}
        >
          Preferencias
        </Button>
      </VStack>
    </Box>
  );
};

export default ProfileSidebar;