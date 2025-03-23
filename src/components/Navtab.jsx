// src/components/NavTab.js
import React from 'react';
import { Flex, Link, Button } from '@chakra-ui/react';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

const NavTab = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuario ha cerrado sesión');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex bg="teal.500" p={4} justifyContent="space-between" alignItems="center">
      <Link href="/" color="white" fontWeight="bold">
        Inicio
      </Link>
      <Button colorScheme="red" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Flex>
  );
};

export default NavTab;