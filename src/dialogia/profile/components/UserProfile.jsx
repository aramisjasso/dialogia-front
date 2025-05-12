import React from 'react';
import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  IconButton,
  Field,
  InputGroup 
} from '@chakra-ui/react';
// import { PencilIcon } from '@chakra-ui/icons'; // Puedes reemplazarlo por el correcto si no se muestra
import { MdEdit } from "react-icons/md"; // Icono de lápiz
import AvatarCarousel from './AvatarCarousel'; //carrusel de avatares

const UserProfile = ({ currentUser }) => {
    // MALR: LISTA DE LOS AVATARS
    const avatars = [
        { id: 1, src: 'avatar_1.jpg' },
        { id: 2, src: 'avatar_2.jpg' },
        { id: 3, src: 'avatar_3.jpg' },
        { id: 4, src: 'avatar_4.jpg' },
        { id: 5, src: 'avatar_5.jpg' },
        { id: 6, src: 'avatar_6.jpg' },
        { id: 7, src: 'avatar_7.jpg' },
        { id: 8, src: 'avatar_8.jpg' },
        { id: 9, src: 'avatar_9.jpg' },
    ];

    // MALR: ID DEL AVATAR SELECCIONADO
    const [selectedAvatar, setSelectedAvatar] = useState(
        avatars.find((a) => a.id === currentUser?.avatarId) || avatars[0]
    );

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt="40px"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
    >
      {/* Avatar Title */}
      <Text fontSize="sm" fontWeight="medium" mb={2}>Avatar</Text>

      {/* Aquí irá el carrusel más adelante */}
        {/* <AvatarCarousel
            avatars={avatars}
            selectedAvatarId={selectedAvatar.id}
            onSelect={(avatar) => setSelectedAvatar(avatar)}
      /> */}

      <Box h="110px" mb={6} bg="gray.100" borderRadius="full" />

      {/* Username Field */}
      <Field.Root mb={4}>
        <Flex justify="space-between" align="center" mb={1}>
          <Field.Label fontSize="sm">Usuario</Field.Label>
        </Flex>
        <InputGroup endElement={
            <IconButton
            size="xs"
            variant="ghost"
            aria-label="Editar usuario"
            >
                <MdEdit />
            </IconButton>}>
            <Input
                value={currentUser?.username || ''}
                isReadOnly
                variant="filled"
                bg="gray.50"  
            />
        </InputGroup>
        
</Field.Root>

      {/* Email Field */}
      <Field.Root mb={4}>
        <Flex justify="space-between" align="center" mb={1}>
          <Field.Label fontSize="sm">Correo</Field.Label>
          
        </Flex>
        <InputGroup endElement={
            <IconButton
            size="xs"
            variant="ghost"
            aria-label="Editar correo"
            >
                <MdEdit />
            </IconButton>}>
            <Input
                value={currentUser?.email || ''}
                isReadOnly
                variant="filled"
                bg="gray.50"  
            />
        </InputGroup>
      </Field.Root>

      {/* Password Field */}
      <Field.Root mb={2}>
        <Field.Label fontSize="sm" mb={1}>Contraseña</Field.Label>
        <Input
          type="password"
          value="********"
          isReadOnly
          variant="filled"
          bg="gray.50"
        />
      </Field.Root>

      <Button
        variant="link"
        colorScheme="blue"
        size="sm"
        mt={1}
        mb={4}
        px={0}
        alignSelf="flex-start"
      >
        Cambiar contraseña
      </Button>

      {/* Action Buttons */}
      <Flex justify="flex-end" gap={3}>
        <Button variant="outline" borderColor="gray.400">
          CANCELAR
        </Button>
        <Button
          bg="black"
          color="white"
          _hover={{ bg: 'gray.800' }}
        >
          GUARDAR
        </Button>
      </Flex>
    </Box>
  );
};

export default UserProfile;
