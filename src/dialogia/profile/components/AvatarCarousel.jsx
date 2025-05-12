import React, { useRef } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AvatarCarousel = ({ avatars, selectedAvatarId, onSelect }) => {
  const scrollRef = useRef(null);
  const visibleItems = useBreakpointValue({ base: 3, md: 5 });

  const scrollAmount = 100; // Cantidad de scroll en píxeles

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box position="relative" width="100%" mb={4}>
      <Flex align="center">
        <IconButton
          icon={<FaChevronLeft />}
          onClick={handleScrollLeft}
          aria-label="Anterior"
          size="sm"
          variant="ghost"
          mr={2}
        />

        <Flex
          ref={scrollRef}
          overflowX="auto"
          gap={4}
          css={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {avatars.map((avatar) => (
            <Box
              key={avatar.id}
              flex="0 0 auto"
              cursor="pointer"
              onClick={() => onSelect(avatar)}
              borderWidth={selectedAvatarId === avatar.id ? '3px' : '1px'}
              borderColor={selectedAvatarId === avatar.id ? 'blue.500' : 'gray.200'}
              borderRadius="full"
              p={1}
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                borderColor: 'blue.300',
              }}
            >
              <Avatar size="md" src={avatar.src} name={`Avatar ${avatar.id}`} />
            </Box>
          ))}
        </Flex>

        <IconButton
          icon={<FaChevronRight />}
          onClick={handleScrollRight}
          aria-label="Siguiente"
          size="sm"
          variant="ghost"
          ml={2}
        />
      </Flex>
    </Box>
  );
};

export default AvatarCarousel;
