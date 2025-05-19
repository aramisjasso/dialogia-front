import React, { useState, useEffect } from "react";
import { FiInfo } from "react-icons/fi";
import { Box, Heading, Input, Button, Text, Flex, Spinner, Field, Link, Popover, IconButton } from "@chakra-ui/react";
import { confirmPasswordReset, verifyPasswordResetCode, getAuth } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";

const RecoverReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const navigate = useNavigate();
  const auth = getAuth();

  // Validación dinámica
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false
  });

  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  useEffect(() => {
    if (newPassword) {
      setPasswordErrors({
        length: newPassword.length < 8,
        lowercase: !/[a-z]/.test(newPassword),
        uppercase: !/[A-Z]/.test(newPassword),
        number: !/[0-9]/.test(newPassword),
        specialChar: !specialChars.test(newPassword)
      });
    }
  }, [newPassword]);

  const isPasswordValid = !Object.values(passwordErrors).some(error => error);

  // Resto del código de verificación...
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        toaster.create({
          title: "Error",
          description: "Código de restablecimiento no válido",
          status: "error",
        });
        navigate("/login");
        return;
      }

      try {
        await verifyPasswordResetCode(auth, oobCode);
        setIsCodeValid(true);
      } catch (e) {
        console.log(e);
        toaster.create({
          title: "Error",
          description: "El enlace de restablecimiento no es válido o ha expirado",
          status: "error",
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyCode();
  }, [oobCode, auth, navigate]);

  const handleResetPassword = async () => {
    if (!isPasswordValid) {
      toaster.create({
        title: "Error",
        description: "La contraseña no cumple con los requisitos",
        status: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Las contraseñas no coinciden",
        status: "error",
      });
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toaster.create({
        title: "Éxito",
        description: "Tu contraseña ha sido restablecida",
        status: "success",
      });
      navigate("/login");
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Verificando enlace de restablecimiento...</Text>
      </Box>
    );
  }

  if (!isCodeValid) {
    return null;
  }

  return (
    <Flex justifyContent="center" alignItems="center" p={8}>
      <Box maxWidth="600px" maxHeight="1200px" width="100%" height="100%" borderWidth="1px" bg="bg" shadow="md" p={8}>
        <Heading size="3xl" mb={10}>Nueva contraseña</Heading>
        <Flex direction="column" gap={4} my={10}> 
          <Field.Root>
            <Field.Label textStyle="sm" m={2}>Contraseña
            <Popover.Root>
                <Popover.Trigger>
                  <Button 
                    variant="ghost" 
                    size="xs" 
                    p={1}
                    borderRadius="full"
                    color="gray.500"
                    _hover={{ bg: "gray.100" }}
                  >
                    <FiInfo size={14} style={{ color: 'inherit' }} />
                  </Button>
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Arrow>
                      <Popover.ArrowTip />
                    </Popover.Arrow>
                    <Popover.Body>
                      <Popover.Title mb={2}>Requisitos de contraseña:</Popover.Title>
                      <Text fontSize="sm">• 8 caracteres mínimo</Text>
                      <Text fontSize="sm">• 1 letra mayúscula</Text>
                      <Text fontSize="sm">• 1 letra minúscula</Text>
                      <Text fontSize="sm">• 1 número</Text>
                      <Text fontSize="sm">• 1 carácter especial</Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </Field.Label>

            <Input
              shadow="md"
              variant="subtle"
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault();
              }} 
              type="password"
              placeholder="Escribe tu contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              borderColor={newPassword ? (isPasswordValid ? "inherit" : "red.300") : "inherit"}
              focusBorderColor={isPasswordValid ? "teal.300" : "red.300"}
            />
            {newPassword && !isPasswordValid && (
              <Box mt={1} fontSize="sm" color="red.500">
                {passwordErrors.length && <Text>• Mínimo 8 caracteres</Text>}
                {passwordErrors.lowercase && <Text>• Al menos una minúscula</Text>}
                {passwordErrors.uppercase && <Text>• Al menos una mayúscula</Text>}
                {passwordErrors.number && <Text>• Al menos un número</Text>}
                {passwordErrors.specialChar && <Text>• Al menos un carácter especial</Text>}
              </Box>
            )}
          </Field.Root>
          
          <Field.Root>
            <Field.Label textStyle="sm" m={2}>Confirmar Contraseña</Field.Label>
            <Input
              shadow="md"
              variant="subtle"
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault();
              }} 
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              borderColor={confirmPassword ? (newPassword === confirmPassword ? "inherit" : "red.300") : "inherit"}
              focusBorderColor={newPassword === confirmPassword ? "teal.300" : "red.300"}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <Text mt={1} fontSize="sm" color="red.500">Las contraseñas no coinciden</Text>
            )}
          </Field.Root>
        </Flex>
        
        <Flex justifyContent="center" alignItems="center">
          <Button 
            colorScheme="teal" 
            onClick={handleResetPassword}
            variant="outline"
            p={8}
            mt={10}
            mb={6}
            borderRadius="0"
            borderWidth="1px"
            textStyle="md"
            isDisabled={!isPasswordValid || newPassword !== confirmPassword || !newPassword}
            _hover={{
              bg: isPasswordValid && newPassword === confirmPassword ? "teal.50" : "transparent"
            }}
            borderColor={
              !isPasswordValid || newPassword !== confirmPassword || !newPassword 
                ? "gray.200" 
                : "black"
            }
          >
            Confirmar
          </Button>
        </Flex>
        
        <Flex justifyContent="center" alignItems="center">
          <Link 
            color="teal" 
            onClick={() => navigate("/login")}
            cursor="pointer"
            mb={16}
          >
            Iniciar sesión
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default RecoverReset;