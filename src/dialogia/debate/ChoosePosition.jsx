import { Button, Flex, Text, Badge, Box, Image  } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { toaster } from "../../components/ui/toaster";
import { useState } from 'react';
import axios from 'axios';

const ChoosePosition = ({ 
  isCreator, 
  initialUserVoted, 
  initialPosition, 
  peopleInFavor = [], 
  peopleAgaist = [], 
  comments = [],
  username,
  id
}) => {

  const [userVoted, setUserVoted] = useState(initialUserVoted);
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const [totalInFavor, setTotalInFavor] = useState(peopleInFavor.length);
  const [totalAgaist, setTotalAgaist] = useState(peopleAgaist.length);

  console.log(isCreator, initialUserVoted, initialPosition, peopleInFavor, peopleAgaist, comments, username)

  // Lógica para determinar si el usuario ya votó
  const hasUserVoted = () => {
    return userVoted || peopleInFavor.includes(username) || peopleAgaist.includes(username);
  };

  const handleVote = async (position) => {
    setUserVoted(true);
    // Actualizar contadores según la posición
    if (position === "InFavor") {
      setTotalInFavor(prev => prev + 1);
      // Si estaba en contra, restar del otro contador
      if (currentPosition === "Agaist") {
        setTotalAgaist(prev => prev - 1);
      }
    } else {
      setTotalAgaist(prev => prev + 1);
      // Si estaba a favor, restar del otro contador
      if (currentPosition === "InFavor") {
        setTotalInFavor(prev => prev - 1);
      }
    }

    setCurrentPosition(position);

    toaster.create({
      title: "¡Postura registrada!",
      status: "success",
      duration: 2000,
    });

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/debates/${id}/vote`, {
      username: username,
      position: position
    });

    setTotalInFavor(response.data.peopleInFavor.length);
    setTotalAgaist(response.data.peopleAgaist.length);
  };

  const handleReset = async () => {
    if (currentPosition === "InFavor") {
      setTotalInFavor(prev => prev - 1);
    } else if (currentPosition === "Agaist") {
      setTotalAgaist(prev => prev - 1);
    }

    setUserVoted(false);
    setCurrentPosition(null);

    toaster.create({
      title: "Postura reiniciada",
      status: "success",
      duration: 2000,
    });

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/debates/${id}/vote`, {
      username: username,
      position: null  // Indica reset
    });

    setTotalInFavor(response.data.peopleInFavor.length);
    setTotalAgaist(response.data.peopleAgaist.length);
  };

  const handleChangePosition = () => {
    const newPosition = currentPosition === "InFavor" ? "Agaist" : "InFavor";
    handleVote(newPosition);
  };

  // Contadores
  const commentsInFavor = comments.filter(c => c.position).length;
  const commentsAgaist = comments.filter(c => !c.position).length;

  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center" gap={8}>
  {/* Sección A FAVOR (izquierda) */}
  <Flex gap={2} align="flex-end">
    <Flex direction="column" align="center" gap={0}>
      <Text fontSize="3xl" fontWeight="bold" color="#9A9A9A">
        {commentsInFavor}
      </Text>
      <Text fontSize="md" fontWeight="bold">
        Comentarios
      </Text>
    </Flex>

    <Flex direction="column" align="center" gap={0} ml={32}>
    <Text fontSize="3xl" fontWeight="bold" color="#9A9A9A">
        {totalInFavor}
      </Text>
      <Text fontSize="md" fontWeight="bold">
        A Favor
      </Text>
    </Flex>

    <Image 
      src="../../../public/A_FAVOR.png"
      ml={16}
      height="120px"      
      width="auto"        
      minWidth="80px"     
      objectFit="contain" 
      alt="Icono A Favor" 
    />

  </Flex>

  {/* Componente central (dinámico) */}
  <Box flex="none" width="25%">
    {hasUserVoted() || isCreator ? (
      <Flex direction="column" align="center" gap={3} width="100%">
        {/* Postura actual */}
        <Flex align="center">
          <Text mr={6} fontWeight="bold">Estás:</Text>
          <Badge 
            bg={currentPosition === "InFavor" ? "#00A76C" : "#C60000"} 
            color="white"
            variant="solid"
            fontSize="sm"
            px={12}
            py={2.5}
            minWidth="180px" 
            textAlign="center"
            display="inline-flex" 
            justifyContent="center"
            borderRadius="full"
          >
            {currentPosition === "InFavor" ? "A FAVOR" : "EN CONTRA"}
          </Badge>
        </Flex>
      
        {/* Botones de acción */}
        {!isCreator && (
          <>
            <Button
              colorScheme={currentPosition === "InFavor" ? "blackAlpha" : "gray"}
              variant={currentPosition === "InFavor" ? "solid" : "outline"}
              size="md"
              width="60%"  // 80% del contenedor padre
              minWidth="200px"  // Ancho mínimo fijo
              borderRadius="lg" 
              borderColor={currentPosition === "InFavor" ? undefined : "black"}
              _hover={{
                borderColor: currentPosition === "InFavor" ? undefined : "black",
              }}
              onClick={handleChangePosition}
            >
              {currentPosition === "InFavor" ? "VOTAR EN CONTRA" : "VOTAR A FAVOR"}
            </Button>

            <Button 
              colorScheme="gray" 
              variant="ghost"
              size="md"
              width="60%"  // 80% del contenedor padre
              minWidth="200px"  // Ancho mínimo fijo
              borderColor="#6B6B6B" // Color gris oscuro para el borde
              bg="#B3B3B3" // Color gris claro para el texto
              color="white"
              borderRadius="lg" 
              onClick={handleReset}
            >
              REINICIAR POSTURA
            </Button>
          </>
        )}

        <Button 
          colorScheme={currentPosition === "InFavor" ? "gray" : "blackAlpha"}
          variant={currentPosition === "InFavor" ? "outline" : "solid"}
          size="md"
          width="60%"  // 80% del contenedor padre
          minWidth="200px"  // Ancho mínimo fijo
          borderColor="black" 
          borderRadius="lg" 
          //onClick={handleReset}
        >
          AGREGAR UN COMENTARIO
        </Button>
      </Flex>
    ) : (
      /* Estado: No ha votado */
      <Flex direction="column" align="center" gap={3}>
        <Text fontWeight="bold" fontSize={"lg"}>Escoge una postura:</Text>
        <Flex gap={2}>
          <Button 
            colorScheme="gray" 
            variant="outline"
            onClick={() => handleVote("InFavor")}
            //leftIcon={<FaThumbsUp />}
            height="72px"          // Altura fija
            minWidth="160px"       // Ancho mínimo
            borderRadius="3xl"    // Bordes completamente redondos
            fontSize="sm"         // Tamaño de texto
            fontWeight="bold"
            px={6}
            borderWidth="1px"  // Grosor del borde
            borderColor="black" // Color negro para el borde
            _hover={{
              bg: "gray.100", // Fondo gris claro al hover
              borderColor: "black" // Mantener borde negro en hover
            }}
          >
            A FAVOR
          </Button>

          <Button 
            colorScheme="blackAlpha" 
            variant="solid"
            onClick={() => handleVote("Agaist")}
            //leftIcon={<FaThumbsDown />}
            height="72px"          // Misma altura
            minWidth="160px"       // Mismo ancho mínimo  
            borderRadius="3xl"    // Bordes igualmente redondos
            fontSize="sm"         // Mismo tamaño de texto
            fontWeight="bold"
            px={6}
          >
            EN CONTRA
          </Button>
        </Flex>
      </Flex>
    )}
  </Box>

  {/* Sección EN CONTRA (derecha) */}
  <Flex gap={2} align="flex-end">
      <Image 
          src="../../../public/EN_CONTRA.png"
          mr={16}
          height="120px"      
          width="auto"        
          minWidth="80px"     
          objectFit="contain" 
          alt="Icono En Contra" 
        />

        <Flex direction="column" align="center" gap={0}>
      <Text fontSize="3xl" fontWeight="bold" color="#9A9A9A">
        {totalAgaist}
      </Text>
      
      <Text fontSize="md" fontWeight="bold">
        En Contra
      </Text>
    </Flex>

    <Flex direction="column" align="center" gap={0}  ml={32}>
      <Text fontSize="3xl" fontWeight="bold" color="#9A9A9A">
        {commentsAgaist}
      </Text>
      
      <Text fontSize="md" fontWeight="bold">
        Comentarios
      </Text>
    </Flex>

  </Flex>
</Box>
  );
};

export default ChoosePosition;