import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Spinner,
  VStack,
  Image,
  Heading,
  Link
} from '@chakra-ui/react';
import { FaReply, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { toaster } from '../../components/ui/toaster';
import ReplyCommentForm from './ReplyCommentForm';
import { useAuth } from '../../contexts/hooks/useAuth';

export default function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesState, setLikesState] = useState({});
  const [sortFavor, setSortFavor] = useState('recent');
  const [sortAgainst, setSortAgainst] = useState('recent');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const user = useAuth();
  const username = user.currentUser.username; 

  const handleReplyClick = (comment) => {
    setSelectedComment(comment);
    setShowReplyForm(true);
  };
  useEffect(() => {
  const fetchDebate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/debates/${id}`,
        {
          method: 'POST',  
          headers: {
            'Content-Type': 'application/json',  
          },
          body: '{}' 
        }
      );
      if (!response.ok) throw new Error('Error al obtener debate');
      const data = await response.json();
      setComments(data.comments || []);
      
      // Verifica si el usuario actual ha votado y su posición
      if (username) {
        const isInFavor = data.peopleInFavor.includes(username);
        const isAgainst = data.peopleAgaist.includes(username);
        setUserPosition(isInFavor ? true : (isAgainst ? false : null));
      }
      
      const initial = {};
      (data.comments || []).forEach(c => {
        initial[c.idComment] = { liked: false, disliked: false };
      });
      setLikesState(initial);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchDebate();
}, [id]);

  const sortComments = (arr, mode) => {
    const a = [...arr];
    if (mode === 'oldest') {
      return a.sort((x, y) => new Date(x.datareg) - new Date(y.datareg));
    }
    if (mode === 'liked') {
      return a.sort((x, y) => (y.likes ?? 0) - (x.likes ?? 0));
    }
    if (mode === 'controversial') {
      return a.sort((x, y) => (y.dislikes ?? 0) - (x.dislikes ?? 0));
    }
    // recent
    return a.sort((x, y) => new Date(y.datareg) - new Date(x.datareg));
  };

  const getParentComment = (paidCommentId) => {
    return comments.find(c => c.idComment === paidCommentId);
  };

console.log(comments);

  const handleLike = async idComment => {
    try {
      if (likesState[idComment]?.liked) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'like', method: 'remove', username: username }),
          }
        );
        if (!res.ok) throw new Error('Error al remover like');
        const updated = await res.json();
        setComments(prev =>
          prev.map(c =>
            c.idComment === idComment ? { ...c, likes: updated.likes } : c
          )
        );
        setLikesState(prev => ({
          ...prev,
          [idComment]: { liked: false, disliked: prev[idComment].disliked },
        }));
        toaster.create({ title: 'Like removido', status: 'success', duration: 2000 });
      } else {
        if (likesState[idComment]?.disliked) {
          await fetch(
            `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'dislike', method: 'remove', username: username  }),
            }
          );
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'like', method: 'add', username: username }),
          }
        );
        if (!res.ok) throw new Error('Error al agregar like');
        const updated = await res.json();
        setComments(prev =>
          prev.map(c =>
            c.idComment === idComment ? { ...c, likes: updated.likes } : c
          )
        );
        setLikesState(prev => ({
          ...prev,
          [idComment]: { liked: true, disliked: false },
        }));
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

  const handleDislike = async idComment => {
    try {
      if (likesState[idComment]?.disliked) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'dislike', method: 'remove', username: username  }),
          }
        );
        if (!res.ok) throw new Error('Error al remover dislike');
        const updated = await res.json();
        setComments(prev =>
          prev.map(c =>
            c.idComment === idComment ? { ...c, dislikes: updated.dislikes } : c
          )
        );
        setLikesState(prev => ({
          ...prev,
          [idComment]: { disliked: false, liked: prev[idComment].liked },
        }));
        toaster.create({ title: 'Dislike removido', status: 'success', duration: 2000 });
      } else {
        if (likesState[idComment]?.liked) {
          await fetch(
            `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'like', method: 'remove', username: username  }),
            }
          );
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'dislike', method: 'add', username: username  }),
          }
        );
        if (!res.ok) throw new Error('Error al agregar dislike');
        const updated = await res.json();
        setComments(prev =>
          prev.map(c =>
            c.idComment === idComment ? { ...c, dislikes: updated.dislikes } : c
          )
        );
        setLikesState(prev => ({
          ...prev,
          [idComment]: { disliked: true, liked: false },
        }));
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

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  const rawFavor = comments.filter(c => c.position);
  const rawAgainst = comments.filter(c => !c.position);
  const inFavor = sortComments(rawFavor, sortFavor);
  const against = sortComments(rawAgainst, sortAgainst);

  const renderComment = (c) => {
    const parentComment = c.paidComment ? getParentComment(c.paidComment) : null;
    
    return (
      <Box
        key={c.idComment}
        bg="gray.100"
        p={4}
        borderRadius="lg"
        m={2}
        position="relative"
      >
        {/* Mostrar comentario padre citado si es una respuesta */}
        

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
                {c.username}
              </Text>
              <Text fontSize="sm" color="gray.500" fontWeight="bold">
                {new Date(c.datareg).toLocaleDateString('es-ES')}{' '}
                {new Date(c.datareg)
                  .toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                  .toLowerCase()}
              </Text>
              <Flex ml={6} mr={6} color="gray.500">
              <Flex _hover={{ color: 'gray.800', cursor: 'pointer' }}
              onClick={() => handleReplyClick(c)} >
              <FaReply />
              <Text ml={2} fontWeight="bold" >
                  Responder
                </Text>
            </Flex >
                
              </Flex>
            </Flex>
            {/*RESPUESTA A COMENTARIO*/}
            {parentComment && (
          <Box 
            bg="gray.200" 
            p={2} 
            borderRadius="md" 
            mb={3}
            borderLeft="4px solid"
            borderColor={parentComment.position ? "blue.500" : "red.500"}
          >
            <Text fontSize="sm" fontWeight="bold" color="gray.600">
              @{parentComment.username}
            </Text>
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {parentComment.argument}
            </Text>
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
            {new Date(parentComment.datareg).toLocaleDateString('es-ES')}{' '}
                {new Date(parentComment.datareg)
                  .toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                  .toLowerCase()}
            </Text>

          </Box>
        )}
            <Text mt={1} color="gray.700" fontSize={['sm', 'md', 'lg']}>
              {c.argument}
            </Text>
            {c.image && <Image src={c.image} mt={2} />}
            {c.refs && c.refs.length > 0 && (
              <Box mt={2}>
                <Text fontSize="sm" fontWeight="semibold">
                  Referencias:
                </Text>
                <VStack align="start" spacing={1} mt={1}>
                  {c.refs.map((r, i) => (
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

        <Box position="absolute" top={parentComment ? "15px" : "5"} right="6">
          <Flex align="center" gap={4}>
            <Box
              color={likesState[c.idComment]?.disliked ? 'red.500' : 'gray.500'}
              _hover={{
                color: likesState[c.idComment]?.disliked ? 'red.600' : 'gray.700',
                cursor: 'pointer',
              }}
              onClick={() => handleDislike(c.idComment)}
            >
              <FaThumbsDown />
            </Box>
            <Box
              color={likesState[c.idComment]?.liked ? 'blue.500' : 'gray.500'}
              _hover={{
                color: likesState[c.idComment]?.liked ? 'blue.600' : 'gray.700',
                cursor: 'pointer',
              }}
              onClick={() => handleLike(c.idComment)}
            >
              <FaThumbsUp />
            </Box>
          </Flex>
        </Box>
      </Box>
    );
  };
  
  return (
    
    <Box p={6}>
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid #CBD5E0',
          margin: '0 16px',
        }}
      />
      <Flex>
        {/* Columna Izquierda: Comentarios a favor */}
        <Box flex={1} pr={4} mt={6}>
          <Flex align="center" justify="space-between">
            <Heading size="md" mb={2}>Comentarios a favor</Heading>
            <select
              style={{ 
                marginLeft: 16,
                padding: '4px 8px',
                border: '1px solid #CBD5E0',
                borderRadius: '4px',
                background: 'white',
                color: '#3d3d3d'
              }}
              value={sortFavor}
              onChange={e => setSortFavor(e.target.value)}
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="liked">Más gustados</option>
              <option value="controversial">Controvertidos</option>
            </select>
          </Flex>
          <VStack spacing={4} align="stretch">
            {inFavor.length === 0 ? (
              <Box p={4} bg="gray.50" borderRadius="md" textAlign="center" mt={3}>
                No se encontraron comentarios
              </Box>
            ) : (
              inFavor.map(c => renderComment(c))
            )}
          </VStack>
        </Box>
        
        {/* Línea vertical separadora */}
        <Box
          style={{
            width: '1px',
            backgroundColor: '#CBD5E0',
            margin: '0 16px',
          }}
        />
        
        {/* Columna Derecha: Comentarios en contra */}
        <Box flex={1} pr={4} mt={6}>
          <Flex align="center" justify="space-between">
            <select
              style={{ 
                marginRight: 16,
                padding: '4px 8px',
                border: '1px solid #CBD5E0',
                borderRadius: '4px',
                background: 'white',
                color: '#3d3d3d'
              }}
              value={sortAgainst}
              onChange={e => setSortAgainst(e.target.value)}
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="liked">Más gustados</option>
              <option value="controversial">Controvertidos</option>
            </select>
            <Heading size="md" mb={2}>
              Comentarios en contra
            </Heading>
          </Flex>
          <VStack spacing={4} align="stretch">
            {against.length === 0 ? (
              <Box p={4} bg="gray.50" borderRadius="md" textAlign="center" mt={3}>
                No se encontraron comentarios
              </Box>
            ) : (
              against.map(c => renderComment(c))
            )}
          </VStack>
        </Box>
      </Flex>



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