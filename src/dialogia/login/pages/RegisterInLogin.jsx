import React, { useState, useEffect } from "react";
import { Button, Box, Heading, Text, Input, Flex, Field } from "@chakra-ui/react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster";
import { useAuth } from "../../../contexts/hooks/useAuth"; // Importa el hook de autenticación
import { onAuthStateChanged } from "firebase/auth";

const RegisterInLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const { refreshUser } = useAuth(); // Usamos el contexto de autenticación
    const USERNAME_MAX_LENGTH = 20;

    const blockInvalidChars = (e) => {
        if ([' ', '@', '/', '\\', '.'].includes(e.key)) {
            e.preventDefault();
        }
        if (username.length >= USERNAME_MAX_LENGTH && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }
    };

    const handleUsernameChange = (e) => {
        const filteredValue = e.target.value
            .replace(/[@\/\\ .]/g, '')
            .slice(0, USERNAME_MAX_LENGTH);
        setUsername(filteredValue);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const checkUsernameExists = async (username) => {
        const userDoc = await getDoc(doc(db, "usernames", username));
        return userDoc.exists();
    };

    const saveUserToFirestore = async (user, username) => {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            username: username,
            censorship: true,
            interests: [] // Añadimos array de intereses vacío por defecto
        });
        await setDoc(doc(db, "usernames", username), { uid: user.uid });
        await setDoc(doc(db, "emails", user.email), { uid: user.uid });
    };

    const handleRegisterWithGoogle = async () => {
        if (!username) {
            toaster.error("Por favor, ingresa un nombre de usuario");
            return;
        }
        if (await checkUsernameExists(username)) {
            toaster.error("El nombre de usuario ya está en uso");
            return;
        }
        if (username.match(/[@\/\\ .]/)) {
            toaster.error("El nombre de usuario no puede contener @, /, \\ o .");
            return;
        }

        try {
            await saveUserToFirestore(user, username);
            
            // Actualiza el contexto de autenticación inmediatamente
            await refreshUser();
            
            // Actualiza localStorage
            localStorage.setItem("username", username);
            localStorage.setItem("censorship", "true");
            
            toaster.success("Registro exitoso");
            navigate("/home"); // Redirige a home directamente
        } catch (error) {
            console.error("Error en registro:", error);
            toaster.error(error.message || "Error durante el registro");
        }
    };

    return (
        <Box
            maxW="500px"
            mx="auto"
            mt={5}
            mb={5}
            p={6}
            borderWidth="1px"
            boxShadow="lg"
            bg="blackAlpha.900"
            color="white"
        >
            <Heading textAlign="left" color="white">
                Regístrate
            </Heading>

            <Flex direction="column" gap={4} mt={6}>
                <Flex justifyContent="space-between" alignItems="center">
                    <Text color="white">Usuario</Text>
                    <Text color="gray.400" fontSize="sm">
                        {username.length}/{USERNAME_MAX_LENGTH}
                    </Text>
                </Flex>
                <Field.Root>
                    <Input
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={handleUsernameChange}
                        onKeyDown={blockInvalidChars}
                        bg="blackAlpha.800"
                        color="white"
                        borderColor="gray.600"
                    />
                </Field.Root>
            </Flex>

            <Flex direction="row" gap={4} mt={6} justifyContent="center">
                <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={handleRegisterWithGoogle}
                    borderRadius="0"
                    borderColor="white"
                    color="white"
                >
                    Registrar tu usuario
                </Button>
            </Flex>
        </Box>
    );
};

export default RegisterInLogin;