// BestComment.jsx
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Flex,
  VStack,
  Image,
  Link,
  Avatar,
} from '@chakra-ui/react';

export default function BestComment({comment}) {
  const [currentComment] = useState(comment);
  const navigate = useNavigate();


  return (
    <Box
      bg="gray.100"
      p={4}
      borderRadius="lg"
      position="relative"
    >
      <Flex align="flex-start" flexWrap="wrap">
        <Avatar.Root style={{ width: 60, height: 60, borderRadius: '9999px', overflow: 'hidden' }} mr={3}  mt={2}>
          <Avatar.Fallback delayMs={600}>{`A${currentComment.user?.id || "1"}`}</Avatar.Fallback>
          <Avatar.Image src={`/avatar_${comment.user?.avatarId || "1" }.jpg`} alt={`Avatar ${currentComment.user?.id || "1"}`} />
        </Avatar.Root>

        <Box flex="1" minW="200px">
          <Flex align="center" flexWrap="wrap">
            <Text fontWeight="bold" mr={2} fontSize={['sm', 'md', 'lg']} cursor="pointer" _hover={{ color: 'blue.600' }} onClick={() => navigate(`/profile/${currentComment.username}`)} >
              {currentComment.username}
            </Text>
            <Text ml={2} fontSize="sm" color="gray.500" fontWeight="bold">
              {new Date(currentComment.datareg).toLocaleDateString('es-ES')}{' '}
            </Text>
            <Text ml={2} fontSize="sm" color="gray.500" fontWeight="bold">
            {new Date(currentComment.datareg)
                .toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
                .toLowerCase()}
              </Text>
          </Flex>
          <Text mt={1} color="gray.700" fontSize={['sm', 'md', 'lg']}>
            {currentComment.argument}
          </Text>
          {currentComment.image && (
            <Image 
              src={currentComment.image}
              alt={`Imagen del comentario`}
              mt={2}
              maxW="300px"  // Tamaño máximo más pequeño
              maxH="200px"  // Altura reducida
              width="auto"
              objectFit="contain"
              borderRadius="md"
              loading="lazy" // Carga diferida
            />
          )}
          {currentComment.refs && currentComment.refs.length > 0 && (
            <Box mt={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Referencias:
              </Text>
              <VStack align="start" spacing={1} mt={1}>
                {currentComment.refs.map((r, i) => (
                  <Link
                    key={i}
                    href={r}
                    fontSize="sm"
                    isExternal
                    _hover={{ textDecoration: 'underline', color: 'blue.500' }}
                  >
                    • {r}
                  </Link>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
}