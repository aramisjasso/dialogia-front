import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { ConfirmDialog } from "../../debate/modals/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import {
  //getAuth,
  signOut,
} from "firebase/auth";
import { toaster } from "../../../components/ui/toaster";

const DeleteAccount = ({ auth }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    await user.getIdToken();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.uid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar cuenta");
      }
      await user.delete();
      await signOut(auth);
      navigate("/");
      toaster.create({
        title: "Tu cuenta ha sido eliminada",
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      //console.log(error.message);
      toaster.create({
        title: "Error al eliminar cuenta",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
<Box mt={12} width="100%">
  <Text fontSize="lg" color="#3D3D3D" fontWeight="bold">
    Datos
  </Text>
  
  {/* Contenedor Flex con alineación estable */}
  <Flex 
    alignItems="center" 
    gap={6} 
    mt={6}
    wrap="nowrap" // Evita saltos de línea
    width="fit-content" // Ajusta al contenido
  >
    {/* Botón con ConfirmDialog */}
    <ConfirmDialog
      title="Eliminar Cuenta"
      message="¿Estás seguro de eliminar tu cuenta?"
      confirmText="Eliminar"
      onConfirm={handleDeleteAccount}
    >
      <Button
        bg="#C90000"
        color="white"
        borderRadius="lg"
        minWidth="180px"
        size="lg"
        flexShrink={0} // Evita que el botón se encoja
      >
        Eliminar
      </Button>
    </ConfirmDialog>

    {/* Texto fijo */}
    <Text 
      fontSize="lg" 
      color="#6C6C6C" 
      fontWeight="bold"
      whiteSpace="nowrap" // Evita saltos de línea
      flexShrink={0} // Fija el ancho del texto
    >
      Eliminar Cuenta
    </Text>
  </Flex>
</Box>
  );
};

export default DeleteAccount;
