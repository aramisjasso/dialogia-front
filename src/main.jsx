// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Importa el componente App
import { ChakraProvider } from "@chakra-ui/react"; // Importa ChakraProvider
import { system } from "@chakra-ui/react/preset";
import { Toaster, toaster } from "./components/ui/toaster"
// Renderiza la aplicación en el elemento con id "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
    <Toaster />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);