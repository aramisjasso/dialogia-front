import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
  Text,
  Spinner,
  VStack,
  Image,
  Heading,
  Link,
  Avatar
} from '@chakra-ui/react';
import { FaReply, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { toaster } from '../../components/ui/toaster';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import ReplyCommentForm from './ReplyCommentForm';
import { useAuth } from '../../contexts/hooks/useAuth';


export default function Comments({censored}) {
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
  const navigate = useNavigate();
  const user = useAuth();
  const username = user.currentUser.username;


  const handleReplyClick = (comment) => {
    setSelectedComment(comment);
    setShowReplyForm(true);
  };
useEffect(() => {
  const debateRef = doc(db, 'debates', id);
  const unsubscribe = onSnapshot(debateRef, snap => {
    if (!snap.exists()) {
      setError('Debate no encontrado');
      return;
    }
     const data = snap.data();
      const debate = {
        idDebate: snap.id,
        nameDebate: data.nameDebate,
        argument: data.argument,
        category: data.category,
        datareg: data.datareg?.toDate?.() || new Date(),
        username: data.username,
        image: data.image,
        refs: data.refs || [],
        comments: data.comments || [],
        popularity: data.popularity || 0,
        peopleInFavor: data.peopleInFavor || [],
        peopleAgaist: data.peopleAgaist || [],
        moderationStatus: data.moderationStatus || 'PENDING',
        moderationReason: data.moderationReason || '',
        followers: data.followers || []
      };
    // filtro de censura:
    let comments = debate.comments || [];
    console.log('after filter, comments:', comments.map(c => c.idComment));
    console.log('censored or not:', censored);
    if (censored === true) {
      
      comments = comments.filter(c => c.moderationStatus === 'APPROVED');
    }
    setComments(comments);
    console.log('render, comments state:', comments.map(c => c.idComment));



    // posición del usuario
    if (username) {
      const inFavor = debate.peopleInFavor.includes(username);
      const against = debate.peopleAgaist.includes(username);
      setUserPosition(inFavor ? true : (against ? false : null));
    }


    // estado de likes/dislikes
    const initial = {};
    comments.forEach(c => {
      initial[c.idComment] = {
        liked:    c.peopleInFavor?.includes(username),
        disliked: c.peopleAgainst?.includes(username)
      };
    });
    setLikesState(initial);
    setLoading(false);
  }, err => {
    console.error(err);
    setError(err.message);
    setLoading(false);
  });


  return () => unsubscribe();
}, [id, censored, username]);


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
  // 1) Guarda el estado previo
  const wasLiked    = likesState[idComment]?.liked;
  const wasDisliked = likesState[idComment]?.disliked;


  // 2) Calcula el nuevo estado optimista
  const optimisticLikesState = {
    ...likesState,
    [idComment]: {
      liked:    !wasLiked,
      disliked: false
    }
  };


  const optimisticComments = comments.map(c => {
    if (c.idComment !== idComment) return c;
    // Ajusta los contadores provisionalmente
    const deltaLike    = wasLiked    ? -1 : +1;
    const deltaDislike = wasDisliked ? -1 :  0;
    return {
      ...c,
      likes:    (c.likes    || 0) + deltaLike,
      dislikes: (c.dislikes || 0) + deltaDislike
    };
  });


  // 3) Aplica el estado optimista
  setLikesState(optimisticLikesState);
  setComments(optimisticComments);


  // 4) Lanza la petición al servidor
  try {
    // Si había dislike previo, quitarlo primero
    if (wasDisliked) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'dislike', method: 'remove', username }),
        }
      );
    }


    // Agregar o quitar like según corresponda
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          method: wasLiked ? 'remove' : 'add',
          username
        }),
      }
    );
    if (!res.ok) throw new Error(res.statusText);


    // (Opcional) Si quieres, repones con el comment real del servidor:
    // const updated = await res.json();
    // setComments(prev => prev.map(c => c.idComment === idComment ? updated : c));


    toaster.create({
      title: wasLiked ? 'Like removido' : 'Like agregado',
      status: 'success',
      duration: 2000
    });


  } catch (err) {
    // 5) Rollback en caso de fallo
    console.error('Error al actualizar like:', err);
    toaster.create({
      title: 'Error al actualizar like',
      description: err.message,
      status: 'error',
      duration: 3000
    });


    // Restaurar estado previo
    setLikesState(prev => ({
      ...prev,
      [idComment]: {
        liked:    wasLiked,
        disliked: wasDisliked
      }
    }));
    setComments(comments);
  }
};




const handleDislike = async idComment => {
  // 1) Guarda el estado previo
  const wasDisliked = likesState[idComment]?.disliked;
  const wasLiked    = likesState[idComment]?.liked;


  // 2) Construye el estado optimista
  const optimisticLikesState = {
    ...likesState,
    [idComment]: {
      disliked: !wasDisliked,
      liked: false
    }
  };


  const optimisticComments = comments.map(c => {
    if (c.idComment !== idComment) return c;
    // Ajusta contadores provisionalmente
    const deltaDislike = wasDisliked ? -1 : +1;
    const deltaLike    = wasLiked    ? -1 :  0;
    return {
      ...c,
      dislikes: (c.dislikes || 0) + deltaDislike,
      likes:    (c.likes    || 0) + deltaLike
    };
  });


  // 3) Aplica el estado optimista
  setLikesState(optimisticLikesState);
  setComments(optimisticComments);


  // 4) Lanza la petición al servidor
  try {
    // Si había like previo, quítalo primero en el servidor
    if (wasLiked) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'like', method: 'remove', username }),
        }
      );
    }


    // Agregar o quitar dislike según corresponda
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/debates/${id}/comments/${idComment}/like`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dislike',
          method: wasDisliked ? 'remove' : 'add',
          username
        }),
      }
    );
    if (!res.ok) throw new Error(res.statusText);


    toaster.create({
      title: wasDisliked ? 'Dislike removido' : 'Dislike agregado',
      status: 'success',
      duration: 2000
    });


  } catch (err) {
    // 5) Rollback en caso de fallo
    console.error('Error al actualizar dislike:', err);
    toaster.create({
      title: 'Error al actualizar dislike',
      description: err.message,
      status: 'error',
      duration: 3000
    });


    // Restaurar estado previo
    setLikesState(prev => ({
      ...prev,
      [idComment]: {
        disliked: wasDisliked,
        liked:    wasLiked
      }
    }));
    setComments(comments);
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
          <Avatar.Root style={{ width: 60, height: 60, borderRadius: '9999px', overflow: 'hidden' }} mr={3}  mt={2}>
            <Avatar.Fallback delayMs={600}>{`A${c.user?.id}`}</Avatar.Fallback>
            <Avatar.Image src={`/avatar_${c.user?.avatarId || "1" }.jpg`} alt={`Avatar ${c.user?.id}`} />
          </Avatar.Root>


          <Box flex="1" minW="200px">
            <Flex align="center" flexWrap="wrap">
              <Text fontWeight="bold" mr={2} fontSize={['sm', 'md', 'lg']} cursor="pointer" _hover={{ color: 'blue.600' }} onClick={() => navigate(`/profile/${c.username}`)}>
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
         <Flex
           align="center"
           color={likesState[c.idComment]?.disliked ? 'red.500' : 'gray.500'}
           _hover={{
             color: likesState[c.idComment]?.disliked ? 'red.600' : 'gray.700',
             cursor: 'pointer',
           }}
           onClick={() => handleDislike(c.idComment)}
         >
           <FaThumbsDown />
           <Text ml={1} fontSize="sm">
             {c.dislikes ?? 0}
           </Text>
         </Flex>
         <Flex
           align="center"
           color={likesState[c.idComment]?.liked ? 'blue.500' : 'gray.500'}
           _hover={{
             color: likesState[c.idComment]?.liked ? 'blue.600' : 'gray.700',
             cursor: 'pointer',
           }}
           onClick={() => handleLike(c.idComment)}
         >
           <FaThumbsUp />
           <Text ml={1} fontSize="sm">
             {c.likes ?? 0}
           </Text>
         </Flex>
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
        setShowReplyForm(false);
      }}
      parentComment={selectedComment}
    />
    </Box>
  );
}