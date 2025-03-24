// src/components/NavTab.js
import React from 'react';
import { Flex, Link, Button } from '@chakra-ui/react';
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

  return (
    <Flex bg="gray.800" p={4} justifyContent="space-between" alignItems="center">
      <Link href="/" color="white" fontWeight="bold">
        Inicio
      </Link>
      <Button colorScheme="gray" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Flex>
  );
};

export default NavTab;