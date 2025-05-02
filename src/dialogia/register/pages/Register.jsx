// src/components/Register.jsx
import React, { useState } from "react";
import { Button, Box, Heading, Text, Input, Flex, Link, Field } from "@chakra-ui/react";
import { loginWithGoogle, registerWithEmail } from "../../../firebase/auth.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { toaster } from "../../../components/ui/toaster";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const navigate = useNavigate();

  // Límites definidos
  const USERNAME_MAX_LENGTH = 20;
  const PASSWORD_MAX_LENGTH = 32;
  const EMAIL_MAX_LENGTH = 254;

  // Verificar si el nombre de usuario ya existe
  const checkUsernameExists = async (username) => {
    const userDoc = await getDoc(doc(db, "usernames", username));
    return userDoc.exists();
  };

  // Verificar si el correo ya está registrado
  const checkEmailExists = async (email) => {
    const userDoc = await getDoc(doc(db, "emails", email));
    return userDoc.exists();
  };

  // Validar formato de email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Guardar usuario en Firestore
  const saveUserToFirestore = async (user, username) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      censorship: true
    });
    await setDoc(doc(db, "usernames", username), { uid: user.uid });
    await setDoc(doc(db, "emails", user.email), { uid: user.uid });
  };

  const handleRegisterWithGoogle = async () => {
    try {
      // 1. Iniciar sesión con Google
      await loginWithGoogle();
      
      // 2. Obtener el usuario actual
      // const user = auth.currentUser;
      // if (!user) throw new Error("No se pudo obtener el usuario");
  
      // 3. Verificar en Firestore si existe
      // const userDocRef = doc(db, "users", user.uid);
      // const userDoc = await getDoc(userDocRef);
  
      // 4. Redirigir según si existe o no

         // Si ya está registrado, va a /home

  
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error",
        description: "Error al iniciar sesión con Google",
        type: "error",
      });
    }
  };

  const handleRegisterWithEmail = async () => {
    if (!username || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Error",
        description: "Por favor, completa todos los campos",
        status: "error",
      });
      return;
    }

    if (username.length > USERNAME_MAX_LENGTH) {
      toaster.create({
        title: "Error",
        description: `El nombre de usuario no puede tener más de ${USERNAME_MAX_LENGTH} caracteres`,
        status: "error",
      });
      return;
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      toaster.create({
        title: "Error",
        description: `El correo electrónico no puede tener más de ${EMAIL_MAX_LENGTH} caracteres`,
        status: "error",
      });
      return;
    }

    if (!validateEmail(email)) {
      toaster.create({
        title: "Error",
        description: "Por favor, ingresa un correo electrónico válido",
        status: "error",
      });
      return;
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
      toaster.create({
        title: "Error",
        description: `La contraseña no puede tener más de ${PASSWORD_MAX_LENGTH} caracteres`,
        status: "error",
      });
      return;
    }

    if (password !== confirmpassword) {
      toaster.create({
        title: "Error",
        description: "Las contraseñas no coinciden",
        status: "error",
      });
      return;
    }

    try {
      if (await checkUsernameExists(username)) {
        toaster.create({
          title: "Error",
          description: "El nombre de usuario ya está en uso",
          status: "error",
        });
        return;
      }

      if (await checkEmailExists(email)) {
        toaster.create({
          title: "Error",
          description: "El correo electrónico ya está registrado",
          status: "error",
        });
        return;
      }
    
      const user = await registerWithEmail(email, password);
      await saveUserToFirestore(user, username);
      navigate("/login");
      window.location.reload();
      toaster.create({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada",
        status: "success",
      });
    } catch (error) {
      let errorMessage = "Error en el registro";
      
      if (error.message.includes("password-does-not-meet-requirements")) {
        errorMessage = "La contraseña debe contener:";
        const missingRequirements = [];
        
        if (error.message.includes("upper case character")) {
          missingRequirements.push("una letra mayúscula (A-Z)");
        }
        if (error.message.includes("numeric character")) {
          missingRequirements.push("un número (0-9)");
        }
        if (error.message.includes("non-alphanumeric character")) {
          missingRequirements.push("un carácter especial (ej: !@#$%)");
        }
        
        errorMessage += " " + missingRequirements.join(", ");
      } else if (error.message.includes("email-already-in-use")) {
        errorMessage = "El correo electrónico ya está registrado";
      } else {
        errorMessage = error.message;
      }

      toaster.create({
        title: "Error",
        description: errorMessage,
        status: "error",
      });
    }
  };

  // Manejar cambios en el nombre de usuario (bloquea caracteres especiales)
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    // Eliminar caracteres no permitidos
    const cleanedValue = value.replace(/[@\/\\\.\s]/g, '');
    
    if (cleanedValue.length <= USERNAME_MAX_LENGTH) {
      setUsername(cleanedValue);
    }
  };

  // Manejar cambios en la contraseña (elimina espacios)
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // Eliminar espacios
    const cleanedValue = value.replace(/\s/g, '');
    
    if (cleanedValue.length <= PASSWORD_MAX_LENGTH) {
      setPassword(cleanedValue);
    }
  };

  // Manejar cambios en la confirmación de contraseña (elimina espacios)
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    // Eliminar espacios
    const cleanedValue = value.replace(/\s/g, '');
    
    if (cleanedValue.length <= PASSWORD_MAX_LENGTH) {
      setConfirmpassword(cleanedValue);
    }
  };

  const handleEmailChange = (e) => {
    if (e.target.value.length <= EMAIL_MAX_LENGTH) {
      setEmail(e.target.value);
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
            bg="blackAlpha.800"
            color="white"
            borderColor="gray.600"
          />
        </Field.Root>

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="white">Correo</Text>
          <Text color="gray.400" fontSize="sm">
            {email.length}/{EMAIL_MAX_LENGTH}
          </Text>
        </Flex>
        <Field.Root>
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChange={handleEmailChange}
            bg="blackAlpha.800"
            color="white"
            borderColor="gray.600"
          />
        </Field.Root>

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="white">Contraseña</Text>
          <Text color="gray.400" fontSize="sm">
            {password.length}/{PASSWORD_MAX_LENGTH}
          </Text>
        </Flex>
        <Field.Root>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={handlePasswordChange}
            bg="blackAlpha.800"
            color="white"
            borderColor="gray.600"
          />
        </Field.Root>

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="white">Confirmar contraseña</Text>
          <Text color="gray.400" fontSize="sm">
            {confirmpassword.length}/{PASSWORD_MAX_LENGTH}
          </Text>
        </Flex>
        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmpassword}
          onChange={handleConfirmPasswordChange}
          bg="blackAlpha.800"
          color="white"
          borderColor="gray.600"
        />
      </Flex>

      <Flex direction="row" gap={4} mt={6} justifyContent="center">
        <Button
          colorScheme="teal"
          variant="outline"
          onClick={handleRegisterWithEmail}
          borderRadius="0"
          borderColor="white"
          color="white"
        >
          Registrarse con Correo
        </Button>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={handleRegisterWithGoogle}
          borderRadius="0"
          borderColor="white"
          color="white"
        >
          Registrarse con Google
        </Button>
      </Flex>

      <Text mt={6} textAlign="center" color="white">
        ¿Ya tienes una cuenta?{" "}
        <Link color="teal.500" href="/login">
          Inicia sesión
        </Link>
      </Text>
    </Box>
  );
};

export default Register;