import { Button, Flex, Text, Badge, useToast, Box } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Ejemplo de íconos

const ChoosePosition = ({ 
  isCreator, 
  userVoted, 
  currentPosition, 
  peopleInFavor = [], 
  peopleAgaist = [], 
  comments = [],
  userId 
}) => {
  const toast = useToast();

  // Lógica para determinar si el usuario ya votó
  const hasUserVoted = () => {
    return userVoted || peopleInFavor.includes(userId) || peopleAgaist.includes(userId);
  };

  // Mock de funciones (las conectaremos al backend después)
  const handleVote = (position) => {
    console.log("Votando:", position);
    toast({
      title: "¡Postura registrada!",
      status: "success",
      duration: 2000,
    });
  };

  const handleReset = () => {
    console.log("Reseteando postura");
  };

  // Contadores
  const totalInFavor = peopleInFavor.length;
  const totalAgaist = peopleAgaist.length;
  const commentsInFavor = comments.filter(c => c.position).length;
  const commentsAgaist = comments.filter(c => !c.position).length;

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text fontWeight="bold" mb={3}>Escoge una postura:</Text>

      {!hasUserVoted() && !isCreator ? (
        <Flex gap={3} align="center">
          {/* Botón A FAVOR */}
          <Button 
            colorScheme="gray" 
            variant="outline"
            onClick={() => handleVote("InFavor")}
            leftIcon={<FaThumbsUp />}
          >
            A FAVOR
          </Button>
          <Badge colorScheme="green">{totalInFavor} personas</Badge>
          <Badge colorScheme="green">{commentsInFavor} comentarios</Badge>

          {/* Botón EN CONTRA */}
          <Button 
            colorScheme="blackAlpha" 
            variant="solid"
            onClick={() => handleVote("Agaist")}
            leftIcon={<FaThumbsDown />}
            ml={4}
          >
            EN CONTRA
          </Button>
          <Badge colorScheme="red">{totalAgaist} personas</Badge>
          <Badge colorScheme="red">{commentsAgaist} comentarios</Badge>
        </Flex>
      ) : (
        <Flex direction="column" gap={3}>
          {/* Estado actual (ya votó o es creador) */}
          <Flex align="center">
            <Text mr={2}>Estás:</Text>
            <Badge 
              colorScheme={currentPosition === "InFavor" ? "green" : "red"} 
              variant="solid"
              fontSize="md"
              px={2}
              py={1}
            >
              {currentPosition === "InFavor" ? "A FAVOR" : "EN CONTRA"}
            </Badge>
          </Flex>

          {/* Botón para cambiar postura (si no es creador) */}
          {!isCreator && (
            <Button
              colorScheme={currentPosition === "InFavor" ? "blackAlpha" : "gray"}
              variant={currentPosition === "InFavor" ? "solid" : "outline"}
              onClick={() => {
                if (window.confirm("¿Seguro que quieres cambiar de postura?")) {
                  handleVote(currentPosition === "InFavor" ? "Agaist" : "InFavor");
                }
              }}
            >
              {currentPosition === "InFavor" ? "VOTAR EN CONTRA" : "VOTAR A FAVOR"}
            </Button>
          )}

          {/* Botón para reiniciar (si no es creador) */}
          {!isCreator && (
            <Button 
              colorScheme="gray" 
              variant="ghost"
              onClick={handleReset}
            >
              REINICIAR POSTURA
            </Button>
          )}

          {isCreator && (
            <Text color="gray.500" fontStyle="italic">
              Como creador del debate, siempre estás A FAVOR.
            </Text>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default ChoosePosition;