import React, { useRef } from 'react';
import { Box, IconButton, Flex, Avatar } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const AvatarCarousel = ({ avatars, selectedAvatarId, onSelect }) => {
  const scrollRef = useRef(null);

  const scrollAmount = 100;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box position="relative" width="100%" mb={4}>
      <Flex align="center">
        <IconButton
          onClick={() => handleScroll('left')}
          aria-label="Anterior"
          size="sm"
          variant="ghost"
          mr={2}
        > 
        <FaChevronLeft />
        </IconButton>

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
              <Avatar.Root style={{ width: 40, height: 40, borderRadius: '9999px', overflow: 'hidden' }}>
                <Avatar.Fallback delayMs={600}>{`A${avatar.id}`}</Avatar.Fallback>
                <Avatar.Image src={avatar.src} alt={`Avatar ${avatar.id}`} />
              </Avatar.Root>
            </Box>
          ))}
        </Flex>

        <IconButton
          onClick={() => handleScroll('right')}
          aria-label="Siguiente"
          size="sm"
          variant="ghost"
          ml={2}
        >
        <FaChevronRight />
        </IconButton>
      </Flex>
    </Box>
  );
};

export default AvatarCarousel;
