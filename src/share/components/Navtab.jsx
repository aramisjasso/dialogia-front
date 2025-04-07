import React, { useState } from 'react';
import { Flex, Link, Button, Image, Avatar, Box, useBreakpointValue, IconButton } from '@chakra-ui/react';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
// Íconos de Lucide (lu)
import { LuSearch, LuMenu, LuLayoutDashboard, LuList, LuInfo, LuFile, LuSettings } from "react-icons/lu";
// Íconos de Feather (fi)
import { FiLogOut } from "react-icons/fi";

const NavTab = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Configuración responsive
  const isMobile = useBreakpointValue({ base: true, md: false });
  const avatarSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      console.log('Usuario ha cerrado sesión');
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    { name: "INICIO", path: "/home", icon: <LuLayoutDashboard size={16} /> },
    { name: "CATEGORIAS", path: "/categories", icon: <LuList size={16} /> },
    { name: "ACERCA DE NOSOTROS", path: "/aboutus", icon: <LuInfo size={16} /> },
    { name: "POLITICAS DE USO", path: "/politic", icon: <LuFile size={16} /> }
  ];

  return (
    <Flex 
      bg="gray.800" 
      p={2}
      alignItems="center"
      flexWrap="nowrap"
      position="relative"
    >
      {/* Logo */}
      <Image
        src="LOGO_NAV.png"
        alt="Dialogia"
        width="100px"
        height="auto"
        objectFit="contain"
        flexShrink={0}
      />

      {/* Contenedor de tabs centrado (solo en desktop) */}
      {!isMobile && (
        <Flex 
          position="absolute" 
          left="50%" 
          transform="translateX(-50%)"
          gap={4}
          alignItems="center"
        >
          {tabs.map((tab, index) => (
            <Link 
              key={index}
              color="white"
              fontSize="sm"
              onClick={() => navigate(tab.path)}
              _hover={{ textDecoration: 'none', opacity: 0.8 }}
              style={{ cursor: "pointer" }}
              display="flex"
              alignItems="center"
              gap={1}
              whiteSpace="nowrap"
            >
              {tab.icon}
              {tab.name}
            </Link>
          ))}
        </Flex>
      )}

      {/* Espacio flexible que empuja los elementos de usuario a la derecha */}
      <Box flex={1} />

      {/* Botón de menú móvil */}
      {isMobile && (
        <IconButton
          ml={2}
          aria-label="Menu"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          color="white"
          variant="ghost"
          flexShrink={0}
        >
          <LuMenu size={20} />
        </IconButton>
      )}

      {/* Acciones del usuario (siempre a la derecha) */}
      <Flex gap={2} alignItems="center" ml={2} flexShrink={0}>
        <IconButton
          aria-label="Buscar"
          onClick={() => navigate('/search')}
          color="white"
          variant="ghost"
          size="sm"
        >
          <LuSearch size={18} />
        </IconButton>

        <Avatar.Root 
          colorPalette="gray" 
          style={{ cursor: "pointer" }} 
          onClick={() => navigate('/profile')}
          size={avatarSize}
        >
          <Avatar.Fallback />
          <Avatar.Image src="https://bit.ly/broken-link" />
        </Avatar.Root>
        
        <Button 
          colorScheme="gray" 
          onClick={handleLogout}
          size="sm"
        >
          {isMobile ? <FiLogOut size={16} /> : "Cerrar Sesión"}
        </Button>
        
        <IconButton
          aria-label="Configuración"
          onClick={() => navigate('/settings')}
          color="white"
          variant="ghost"
          size="sm"
        >
          <LuSettings size={18} />
        </IconButton>
      </Flex>

      {/* Menú móvil desplegable */}
      {isMobile && showMobileMenu && (
        <Box 
          position="absolute"
          top="60px"
          left={0}
          right={0}
          bg="gray.700" 
          p={2}
          zIndex="dropdown"
        >
          {tabs.map((tab, index) => (
            <Box 
              key={index}
              color="white"
              fontSize="sm"
              p={2}
              onClick={() => {
                navigate(tab.path);
                setShowMobileMenu(false);
              }}
              _hover={{ bg: 'gray.600' }}
              style={{ cursor: "pointer" }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              {tab.icon}
              {tab.name}
            </Box>
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default NavTab;