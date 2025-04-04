import React from 'react';
import { Flex, Link, Button, For, Image, Avatar  } from '@chakra-ui/react';
import { HiCog } from "react-icons/hi"
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu"

const NavTab = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/")
      console.log('Usuario ha cerrado sesión');
    } catch (error) {
      console.error(error);
    }
  };
  const tabs = ["INICIO", "CATEGORIAS", "ACERCA DE NOSOTROS", "POLITICAS DE USO"];
  const index = ["/home", "/categories", "/aboutus", "/politic"];

  return (
    <Flex bg="gray.800" p={2} justifyContent="space-between" alignItems="center">
      <Image
        src="LOGO_NAV.png" // Reemplaza con tu ilustración
        alt="Dialogia"
        width="100px" // Ancho fijo
        height="auto" // Alto automático (mantiene proporción)
        objectFit="contain" // Asegura que toda la imagen sea visible
      />
      <For each={tabs}>
        {(tab, x) => (
          <Link 
            key={x}
            color="white"
            fontSize="xs"
            onClick={() => navigate(index[x])}  // 🔥 Navega usando useNavigate()
            style={{ cursor: "pointer" }}       // Para que parezca un enlace
          >
            {tab}
          </Link>
        )}
      </For>
      <LuSearch
      style={{ cursor: "pointer" }}       // Para que parezca un enlace
      color='white'
      onClick={() => navigate('/search')}/>
      <Flex bg="gray.800" justifyContent="space-between" alignItems="center">
        
        <Avatar.Root colorPalette="gray">
          <Avatar.Fallback />
          <Avatar.Image src="https://bit.ly/broken-link" />
        </Avatar.Root>
        <Button colorScheme="gray" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
        <Button 
        // variant="outline" 
        size="sm">
          <HiCog />
        </Button>
      </Flex>
      
    </Flex>
  );
};

export default NavTab;