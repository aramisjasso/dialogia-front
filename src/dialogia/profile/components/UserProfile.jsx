import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  IconButton,
  InputGroup,
} from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import AvatarCarousel from './AvatarCarousel';
import { useNavigate } from 'react-router-dom';
import { toaster } from "../../../components/ui/toaster";

const UserProfile = ({ currentUser, refreshUser }) => {
  const navigate = useNavigate();

  const avatars = [
    { id: 1, src: '/avatar_1.jpg' },
    { id: 2, src: '/avatar_2.jpg' },
    { id: 3, src: '/avatar_3.jpg' },
    { id: 4, src: '/avatar_4.jpg' },
    { id: 5, src: '/avatar_5.jpg' },
    { id: 6, src: '/avatar_6.jpg' },
    { id: 7, src: '/avatar_7.jpg' },
    { id: 8, src: '/avatar_8.jpg' },
    { id: 9, src: '/avatar_9.jpg' },
  ];

  const [editFields, setEditFields] = useState({ username: false, email: false });
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    avatarId: currentUser.avatarId,
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarSelect = (avatar) => {
    setFormData((prev) => ({ ...prev, avatarId: avatar.id }));
  };

  const handleCancel = () => {
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      avatarId: currentUser.avatarId,
    });
    setEditFields({ username: false, email: false });
  };

  const handleSave = async () => {
    try {
      let respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user/${currentUser.uid}/updatedata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      console.log('User updated successfully',formData);
      if (!respuesta.ok) {
        console.error('Error al actualizar el usuario', respuesta);
        throw new Error('Error al actualizar el usuario');
      }else {
        console.log('User updated successfully');
      }
      
      toaster.create({
        title: 'Perfil actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      refreshUser();
      setEditFields({ username: false, email: false });
    } catch (err) {
      toaster.create({
        title: 'Error al actualizar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const hasChanges =
    formData.username !== currentUser.username
    formData.email !== currentUser.email
    formData.avatarId !== currentUser.avatarId;

  return (
    <Box maxW="600px" mx="auto" mt="40px" p={6} borderWidth="1px" borderRadius="lg" boxShadow="sm">
      <Text fontSize="sm" fontWeight="medium" mb={2}>Avatar</Text>
      {/* Avatar Carousel */}
      <AvatarCarousel
        avatars={avatars}
        selectedAvatarId={formData.avatarId}
        onSelect={handleAvatarSelect}
      />


      {/* Username */}
      <Flex direction="column" mb={4}>
        <Text fontSize="sm" mb={1}>Usuario</Text>
        <InputGroup endElement={
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Editar usuario"
            onClick={() => setEditFields((prev) => ({ ...prev, username: true }))}
          >
          <MdEdit />
          </IconButton>
        }>
          <Input
            value={formData.username}
            onChange={handleChange('username')}
            isReadOnly={!editFields.username}
            variant={editFields.username ? 'outline' : 'filled'}
            bg={!editFields.username ? 'gray.50' : undefined}
          />
        </InputGroup>
      </Flex>

      {/* Email */}
      <Flex direction="column" mb={4}>
        <Text fontSize="sm" mb={1}>Correo</Text>
        <InputGroup endElement={
          <IconButton
            size="xs"
            variant="ghost"
            
            aria-label="Editar correo"
            onClick={() => setEditFields((prev) => ({ ...prev, email: true }))}
          >
          <MdEdit />
          </IconButton>
          }>
          <Input
            value={formData.email}
            onChange={handleChange('email')}
            isReadOnly={!editFields.email}
            variant={editFields.email ? 'outline' : 'filled'}
            bg={!editFields.email ? 'gray.50' : undefined}
          />
        </InputGroup>
      </Flex>

      {/* Contraseña */}
      <Flex direction="column" mb={2}>
        <Text fontSize="sm" mb={1}>Contraseña</Text>
        <Input
          type="password"
          value="********"
          isReadOnly
          variant="filled"
          bg="gray.50"
        />
        <Button
          variant="link"
          colorScheme="blue"
          size="sm"
          mt={1}
          alignSelf="flex-start"
          onClick={() => navigate('/change-password')}
        >
          Cambiar contraseña
        </Button>
      </Flex>

      {/* Botones de acción */}
      {hasChanges && (
        <Flex justify="flex-end" gap={3}>
          <Button variant="outline" borderColor="gray.400" onClick={handleCancel}>
            CANCELAR
          </Button>
          <Button
            bg="black"
            color="white"
            _hover={{ bg: 'gray.800' }}
            onClick={handleSave}
          >
            GUARDAR
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default UserProfile;
