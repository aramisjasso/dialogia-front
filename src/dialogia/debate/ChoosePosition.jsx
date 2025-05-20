import { Button, Flex, Text, Badge, Box, Image } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import { useState, useEffect } from "react";
import axios from "axios";
import { ConfirmDialog } from "./modals/ConfirmDialog";
import CommentForm from "./CommentForm";

const ChoosePosition = ({
  isCreator,
  initialUserVoted,
  initialPosition,
  onPositionChange,
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

  // Local state para comentarios, para actualizar en caliente
  const [localComments, setLocalComments] = useState(comments);

  // Estado para mostrar/ocultar el formulario
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setCurrentPosition(initialPosition);
    setUserVoted(initialUserVoted);
  }, [initialPosition, initialUserVoted]);

    // recalcular si la prop comments cambia desde el padre
    useEffect(() => {
      setLocalComments(comments);
    }, [comments]);

  const handleVote = async (position) => {
    setUserVoted(true);
    setCurrentPosition(position);
    onPositionChange(position);

    toaster.create({
      title: "¡Postura registrada!",
      status: "success",
      duration: 2000,
    });

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/debates/${id}/position`, {
      username: username,
      position: position
    });

    setTotalInFavor(response.data.peopleInFavor.length);
    setTotalAgaist(response.data.peopleAgaist.length);
  };

  const handleReset = async () => {
    setUserVoted(false);
    setCurrentPosition(null);
    onPositionChange(null);

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/debates/${id}/position`, {
      username: username,
      position: null 
    });

    setTotalInFavor(response.data.peopleInFavor.length);
    setTotalAgaist(response.data.peopleAgaist.length);

    toaster.create({
      title: "Postura reiniciada",
      status: "success",
      duration: 2000,
    });
  };

  const handleChangePosition = async () => {
    const newPosition =
      currentPosition === "InFavor" ? "Agaist" : "InFavor";
    await handleVote(newPosition);
  };

  // Calcula contadores a partir de localComments
  const commentsInFavor = localComments.filter((c) => c.position).length;
  const commentsAgaist = localComments.filter((c) => !c.position).length;

    // Callback que pasamos a CommentForm
    const handleNewComment = (newComment) => {
      setLocalComments((prev) => [...prev, newComment]);
    };

  return (
<Box 
  p={{ base: 2, md: 4 }} 
  display="flex" 
  flexDirection={{ base: "column", lg: "row" }}
  justifyContent="center" 
  alignItems="center" 
  gap={{ base: 4, md: 8 }}
  width="100%"
>

  {/* Sección A FAVOR - Reorganizada para móvil */}
  <Flex 
    gap={{ base: 1, md: 2 }} 
    align="center"
    order={{ base: 1, lg: 1 }}
    width={{ base: "100%", lg: "auto" }}
    justifyContent={{ base: "space-between", lg: "flex-end" }}
  >
    {/* Contenido numérico */}
    <Flex direction={{ base: "column", sm: "row" }} align="center" gap={{ base: 0, sm: 4 }}>
      <Flex direction="column" align="center">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#9A9A9A">
          {commentsInFavor}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" textAlign="center">
          Comentarios
        </Text>
      </Flex>

      <Flex direction="column" align="center">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#9A9A9A">
          {totalInFavor}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" textAlign="center">
          A Favor
        </Text>
      </Flex>
    </Flex>

    {/* Imagen - Cambia de posición en móvil */}
    <Image
      src="/A_FAVOR.png"
      height={{ base: "80px", md: "120px" }}
      width="auto"
      minWidth={{ base: "60px", md: "80px" }}
      objectFit="contain"
      alt="Icono A Favor"
      order={{ base: -1, sm: 1 }}
      ml={{ base: 0, sm: 4, lg: 16 }}
    />
  </Flex>

  {/* Componente central - Ahora en medio en móvil */}
  <Box 
    flex="none" 
    width={{ base: "100%", lg: "25%" }} 
    order={{ base: 3, lg: 2 }}
    my={{ base: 4, lg: 0 }}
  >
    {userVoted || isCreator ? (
      <Flex direction="column" align="center" gap={3} width="100%">
        {/* Postura actual */}
        <Flex align="center" flexDirection={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 0 }}>
          <Text mr={{ sm: 6 }} fontWeight="bold" mb={{ base: 2, sm: 0 }}>
            Estás:
          </Text>
          <Badge
            bg={currentPosition === "InFavor" ? "#00A76C" : "#C60000"}
            color="white"
            variant="solid"
            fontSize="sm"
            px={{ base: 8, md: 12 }}
            py={2.5}
            minWidth={{ base: "140px", md: "180px" }}
            textAlign="center"
            display="inline-flex"
            justifyContent="center"
            borderRadius="full"
          >
            {currentPosition === "InFavor" ? "A favor" : "En contra"}
          </Badge>
        </Flex>

        {/* Botones de acción */}
        {!isCreator && (
          <>
            <ConfirmDialog
              title="Cambiar postura"
              message="¿Estás seguro de cambiar tu postura?"
              confirmText="Confirmar"
              onConfirm={handleChangePosition}
            >
              <Box width="100%" display="flex" justifyContent="center">
                <Button
                  colorScheme={currentPosition === "InFavor" ? "blackAlpha" : "gray"}
                  variant={currentPosition === "InFavor" ? "solid" : "outline"}
                  size="md"
                  width={{ base: "100%", md: "60%" }}
                  minWidth={{ base: "auto", md: "300px" }}
                  borderRadius="lg"
                  borderColor={currentPosition === "InFavor" ? undefined : "black"}
                  _hover={{
                    borderColor: currentPosition === "InFavor" ? undefined : "black",
                  }}
                >
                  {currentPosition === "InFavor" ? "Votar en contra" : "Votar a favor"}
                </Button>
              </Box>
            </ConfirmDialog>

            <ConfirmDialog
              title="Reiniciar postura"
              message="¿Estás seguro de reiniciar tu postura?"
              onConfirm={handleReset}
            >
              <Box width="100%" display="flex" justifyContent="center">
                <Button
                  colorScheme="gray"
                  variant="ghost"
                  size="md"
                  width={{ base: "100%", md: "60%" }}
                  minWidth={{ base: "auto", md: "300px" }}
                  borderColor="#6B6B6B"
                  bg="#B3B3B3"
                  color="white"
                  borderRadius="lg"
                >
                  Reiniciar postura
                </Button>
              </Box>
            </ConfirmDialog>
          </>
        )}

        <Button
          colorScheme={currentPosition === "InFavor" ? "gray" : "blackAlpha"}
          variant={currentPosition === "InFavor" ? "outline" : "solid"}
          size="md"
          width={{ base: "100%", md: "60%" }}
          minWidth={{ base: "auto", md: "300px" }}
          borderColor="black"
          borderRadius="lg"
          onClick={() => {
            if (currentPosition) setShowForm(true);
            else
              toaster.create({
                title: "Elige una postura primero",
                status: "warning",
              });
          }}
        >
          Agregar un comentario
        </Button>
      </Flex>
    ) : (
      /* Estado: No ha votado */
      <Flex direction="column" align="center" gap={3} width="100%">
        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} textAlign="center">
          Escoge una postura:
        </Text>
        <Flex gap={2} width="100%" justifyContent="center" flexWrap="wrap">
          <Button
            colorScheme="gray"
            variant="outline"
            onClick={() => handleVote("InFavor")}
            height={{ base: "56px", md: "72px" }}
            minWidth={{ base: "120px", md: "160px" }}
            borderRadius="3xl"
            fontSize="sm"
            fontWeight="bold"
            px={6}
            borderWidth="1px"
            borderColor="black"
            _hover={{
              bg: "gray.100",
              borderColor: "black",
            }}
            flex="1 1 auto"
            maxWidth={{ base: "48%", sm: "none" }}
          >
            A Favor
          </Button>

          <Button
            colorScheme="blackAlpha"
            variant="solid"
            onClick={() => handleVote("Agaist")}
            height={{ base: "56px", md: "72px" }}
            minWidth={{ base: "120px", md: "160px" }}
            borderRadius="3xl"
            fontSize="sm"
            fontWeight="bold"
            px={6}
            flex="1 1 auto"
            maxWidth={{ base: "48%", sm: "none" }}
          >
            En Contra
          </Button>
        </Flex>
      </Flex>
    )}
  </Box>

  {/* Sección EN CONTRA - Reorganizada para móvil */}
  <Flex 
    gap={{ base: 1, md: 2 }} 
    align="center"
    order={{ base: 2, lg: 3 }}
    width={{ base: "100%", lg: "auto" }}
    justifyContent={{ base: "space-between", lg: "flex-start" }}
  >
    {/* Imagen - Cambia de posición en móvil */}
    <Image
      src="/EN_CONTRA.png"
      height={{ base: "80px", md: "120px" }}
      width="auto"
      minWidth={{ base: "60px", md: "80px" }}
      objectFit="contain"
      alt="Icono En Contra"
      mr={{ base: 0, sm: 4, lg: 16 }}
    />

    {/* Contenido numérico */}
    <Flex direction={{ base: "column", sm: "row" }} align="center" gap={{ base: 0, sm: 4 }}>
      <Flex direction="column" align="center">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#9A9A9A">
          {totalAgaist}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" textAlign="center">
          En Contra
        </Text>
      </Flex>

      <Flex direction="column" align="center">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#9A9A9A">
          {commentsAgaist}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" textAlign="center">
          Comentarios
        </Text>
      </Flex>
    </Flex>
  </Flex>

  {/* Formulario overlay */}
  <CommentForm
    isVisible={showForm}
    onCancel={() => setShowForm(false)}
    onNewComment={handleNewComment} 
    isInFavor={currentPosition === "InFavor"}
  />
</Box>
  );
};

export default ChoosePosition;