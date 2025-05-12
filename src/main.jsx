// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Importa el componente App
import { ChakraProvider } from "@chakra-ui/react"
import { system } from "@chakra-ui/react/preset";
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext'
// Renderiza la aplicación en el elemento con id "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <AuthProvider>
        <Toaster />
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);