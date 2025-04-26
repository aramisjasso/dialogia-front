// BestComment.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  VStack,
  Image,
  Link
} from '@chakra-ui/react';
import { FaReply, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { toaster } from '../../components/ui/toaster';
import ReplyCommentForm from './ReplyCommentForm';

export default function BestComment({ comment, debateId, userPosition }) {
  const [likesState, setLikesState] = useState({ liked: false, disliked: false });
  const [currentComment, setCurrentComment] = useState(comment);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [comments, setComments] = useState([]);

  const handleReplyClick = (comment) => {
    setSelectedComment(comment);
    setShowReplyForm(true);
  };

  useEffect(() => {
    // Inicializar el estado de likes
    setLikesState({
      liked: false,
      disliked: false
    });
  }, [comment]);

  const handleLike = async () => {
    try {
      if (likesState.liked) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${debateId}/comments/${currentComment.idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'like', method: 'remove' }),
          }
        );
        if (!res.ok) throw new Error('Error al remover like');
        const updated = await res.json();
        setCurrentComment(prev => ({ ...prev, likes: updated.likes }));
        setLikesState(prev => ({ ...prev, liked: false }));
        toaster.create({ title: 'Like removido', status: 'success', duration: 2000 });
      } else {
        if (likesState.disliked) {
          await fetch(
            `${import.meta.env.VITE_API_URL}/debates/${debateId}/comments/${currentComment.idComment}/like`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'dislike', method: 'remove' }),
            }
          );
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${debateId}/comments/${currentComment.idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'like', method: 'add' }),
          }
        );
        if (!res.ok) throw new Error('Error al agregar like');
        const updated = await res.json();
        setCurrentComment(prev => ({ ...prev, likes: updated.likes }));
        setLikesState({ liked: true, disliked: false });
        toaster.create({ title: 'Like agregado', status: 'success', duration: 2000 });
      }
    } catch (err) {
      console.error(err);
      toaster.create({
        title: 'Error al actualizar like',
        description: err.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDislike = async () => {
    try {
      if (likesState.disliked) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${debateId}/comments/${currentComment.idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'dislike', method: 'remove' }),
          }
        );
        if (!res.ok) throw new Error('Error al remover dislike');
        const updated = await res.json();
        setCurrentComment(prev => ({ ...prev, dislikes: updated.dislikes }));
        setLikesState(prev => ({ ...prev, disliked: false }));
        toaster.create({ title: 'Dislike removido', status: 'success', duration: 2000 });
      } else {
        if (likesState.liked) {
          await fetch(
            `${import.meta.env.VITE_API_URL}/debates/${debateId}/comments/${currentComment.idComment}/like`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'like', method: 'remove' }),
            }
          );
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${debateId}/comments/${currentComment.idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'dislike', method: 'add' }),
          }
        );
        if (!res.ok) throw new Error('Error al agregar dislike');
        const updated = await res.json();
        setCurrentComment(prev => ({ ...prev, dislikes: updated.dislikes }));
        setLikesState({ disliked: true, liked: false });
        toaster.create({ title: 'Dislike agregado', status: 'success', duration: 2000 });
      }
    } catch (err) {
      console.error(err);
      toaster.create({
        title: 'Error al actualizar dislike',
        description: err.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box
      bg="gray.100"
      p={4}
      borderRadius="lg"
      m={2}
      position="relative"
    >
      <Flex align="flex-start" flexWrap="wrap">
        <Image
          src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
          maxH="60px"
          maxW="60px"
          objectFit="cover"
          mr={3}
          mt={2}
        />
        <Box flex="1" minW="200px">
          <Flex align="center" flexWrap="wrap">
            <Text fontWeight="bold" mr={2} fontSize={['sm', 'md', 'lg']}>
              {currentComment.username}
            </Text>
            <Text fontSize="sm" color="gray.500" fontWeight="bold">
              {new Date(currentComment.datareg).toLocaleDateString('es-ES')}{' '}
              {new Date(currentComment.datareg)
                .toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
                .toLowerCase()}
            </Text>
            <Flex ml={6} mr={6} color="gray.500">
              <Flex _hover={{ color: 'gray.800', cursor: 'pointer' }}
                onClick={() => handleReplyClick(currentComment)} >
                <FaReply />
                <Text ml={2} fontWeight="bold" >
                    Responder
                  </Text>
              </Flex >
            </Flex>
          </Flex>
          <Text mt={1} color="gray.700" fontSize={['sm', 'md', 'lg']}>
            {currentComment.argument}
          </Text>
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
      
      <Box position="absolute" top="5" right="6">
        <Flex align="center" gap={4}>
          <Box
            color={likesState.disliked ? 'red.500' : 'gray.500'}
            _hover={{
              color: likesState.disliked ? 'red.600' : 'gray.700',
              cursor: 'pointer',
            }}
            onClick={handleDislike}
          >
            <FaThumbsDown />
          </Box>
          <Box
            color={likesState.liked ? 'blue.500' : 'gray.500'}
            _hover={{
              color: likesState.liked ? 'blue.600' : 'gray.700',
              cursor: 'pointer',
            }}
            onClick={handleLike}
          >
            <FaThumbsUp />
          </Box>
        </Flex>
      </Box>
      <ReplyCommentForm
        isVisible={showReplyForm}
        onCancel={() => setShowReplyForm(false)}
        isInFavor={userPosition}
        onNewComment={(newComment) => {
          setComments(prev => [...prev, newComment]);
          setShowReplyForm(false);
        }}
        parentComment={selectedComment}
      />
    </Box>
  );
}