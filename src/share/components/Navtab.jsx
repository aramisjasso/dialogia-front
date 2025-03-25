import React from 'react';
import { Flex, Link, Button, For } from '@chakra-ui/react';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

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
    <Flex bg="gray.800" p={4} justifyContent="space-between" alignItems="center">
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
      
      <Button colorScheme="gray" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Flex>
  );
};

export default NavTab;