// src/App.jsx
import React from "react";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase"; // Importa la instancia de auth
import { onAuthStateChanged } from "firebase/auth";
import { RouterProvider } from "react-router-dom";
// import createAppRouter from "./router";

import NaviRoutersDialogia from "./navigation/NaviRoutersDialogia" 
import Footer from "./share/footer/Footer";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Root from "./dialogia/root/pages/Root";
import Register from "./dialogia/register/pages/Register";
import Login from "./dialogia/login/pages/Login";
import Layout from "./share/components/Layout"; // Importa el Layout
import HomeDebate from "./dialogia/home/pages/Home";
// import { div } from "framer-motion/client";

function App() {
    // Observador de autenticación
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
  
      return () => unsubscribe();
    }, []);
    const router = NaviRoutersDialogia(user);
  return (
    <>
    <RouterProvider router={router} />
    
    </>
  );
}

export default App;