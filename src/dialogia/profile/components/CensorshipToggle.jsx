import { Box, Text, Flex, Button, Switch } from "@chakra-ui/react";
import { ConfirmDialog } from "../../debate/modals/ConfirmDialog";
import { toaster } from "../../../components/ui/toaster";
import { useState } from 'react';

const CensorshipToggle = ({ currentUser, CensorshipChange, censorshipValue, refreshUser }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleCensorship = async () => {

    setIsLoading(true);
    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${currentUser.uid}/censure`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          censorship: !censorshipValue
        })
      });
      await refreshUser();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar censura');
      }

      CensorshipChange(!censorshipValue);
      localStorage.setItem("censorship", `${censorshipValue}`);
      toaster.create({
        title: `Filtro ${!censorshipValue ? 'activado' : 'desactivado'}`,
        description: !censorshipValue 
          ? 'El contenido sensible estará oculto' 
          : 'Verás todo el contenido',
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      toaster.create({
        title: "Error al actualizar censura",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mt={12}>
      <Text fontSize="lg" color="#3D3D3D" fontWeight="bold">Filtro de Contenido</Text>
      
      <ConfirmDialog
        title={`${censorshipValue ? 'Desactivar' : 'Activar'} Filtro de Censura`}
        message={`¿Estás seguro de ${censorshipValue ? 'desactivar' : 'activar'} el filtro de contenido sensible?`}
        confirmText={censorshipValue ? 'Desactivar' : 'Activar'}
        onConfirm={handleToggleCensorship}
      >
        <Flex alignItems="center" gap={6} mt={6}>
          <Switch.Root
            checked={censorshipValue}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label />
          </Switch.Root>
          <Text fontSize="lg" color="#6C6C6C" fontWeight="bold">
            {censorshipValue ? 'Filtro ACTIVADO' : 'Filtro DESACTIVADO'}
          </Text>
        </Flex>
      </ConfirmDialog>

      <Text mt={2} fontSize="md" color="#6C6C6C">
        {censorshipValue 
          ? 'Ocultando contenido sensible' 
          : 'Mostrando todo el contenido'}
      </Text>
    </Box>
  );
};

export default CensorshipToggle;