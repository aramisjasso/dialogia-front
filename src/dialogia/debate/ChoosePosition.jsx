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

  // // Envío de comentario a la API y actualización en caliente
  // const handleSubmitComment = async ({ comentario, referencia }) => {
  //   const positionBool = currentPosition === "InFavor";
  //   const payload = {
  //     username,
  //     text: comentario,
  //     refs: referencia ? [referencia] : [],
  //     position: positionBool,
  //   };
  //   const res = await axios.post(
  //     `${import.meta.env.VITE_API_URL}/debates/${id}/comments`,
  //     payload
  //   );
  //   onNewComment(res.data);
  // };

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
          src="/A_FAVOR.png"
          ml={16}
          height="120px"
          width="auto"
          minWidth="80px"
          objectFit="contain"
          alt="Icono A Favor"
        />
      </Flex>

      {/* Componente central */}
      <Box flex="none" width="25%">
        {userVoted || isCreator ? (
          <Flex direction="column" align="center" gap={3} width="100%">
            {/* Postura actual */}
            <Flex align="center">
              <Text mr={6} fontWeight="bold">
                Estás:
              </Text>
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
                      width="60%"
                      minWidth="300px"
                      borderRadius="lg"
                      borderColor={currentPosition === "InFavor" ? undefined : "black"}
                      _hover={{
                        borderColor: currentPosition === "InFavor" ? undefined : "black",
                      }}
                      mx="auto"
                    >
                      {currentPosition === "InFavor" ? "VOTAR EN CONTRA" : "VOTAR A FAVOR"}
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
                      width="60%"
                      minWidth="300px"
                      borderColor="#6B6B6B"
                      bg="#B3B3B3"
                      color="white"
                      borderRadius="lg"
                      mx="auto"
                    >
                      REINICIAR POSTURA
                    </Button>
                  </Box>
                </ConfirmDialog>
              </>
            )}

            <Button
              colorScheme={currentPosition === "InFavor" ? "gray" : "blackAlpha"}
              variant={currentPosition === "InFavor" ? "outline" : "solid"}
              size="md"
              width="60%"
              minWidth="300px"
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
              AGREGAR UN COMENTARIO
            </Button>
          </Flex>
        ) : (
          /* Estado: No ha votado */
          <Flex direction="column" align="center" gap={3}>
            <Text fontWeight="bold" fontSize={"lg"}>
              Escoge una postura:
            </Text>
            <Flex gap={2}>
              <Button
                colorScheme="gray"
                variant="outline"
                onClick={() => handleVote("InFavor")}
                height="72px"
                minWidth="160px"
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
              >
                A FAVOR
              </Button>

              <Button
                colorScheme="blackAlpha"
                variant="solid"
                onClick={() => handleVote("Agaist")}
                height="72px"
                minWidth="160px"
                borderRadius="3xl"
                fontSize="sm"
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
          src="/EN_CONTRA.png"
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

        <Flex direction="column" align="center" gap={0} ml={32}>
          <Text fontSize="3xl" fontWeight="bold" color="#9A9A9A">
            {commentsAgaist}
          </Text>

          <Text fontSize="md" fontWeight="bold">
            Comentarios
          </Text>
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
