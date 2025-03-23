// src/App.jsx
import React from "react";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase"; // Importa la instancia de auth
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout"; // Importa el Layout
import HomeDebate from "./components/HomeDebate";

function App() {
    // Observador de autenticación
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
  
      return () => unsubscribe();
    }, []);

  return (
    <Router>
      <Routes>
        {/* Ruta raíz: solo para usuarios no autenticados */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" /> // Redirige a /home si el usuario está autenticado
            ) : (
              <Layout>
                <Home />
              </Layout>
            )
          }
        />

        {/* Ruta de registro: solo para usuarios no autenticados */}
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/home" /> // Redirige a /home si el usuario está autenticado
            ) : (
              <Layout>
                <Register />
              </Layout>
            )
          }
        />

        {/* Ruta de login: solo para usuarios no autenticados */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/home" /> // Redirige a /home si el usuario está autenticado
            ) : (
              <Layout>
                <Login />
              </Layout>
            )
          }
        />

        {/* Ruta de home: solo para usuarios autenticados */}
        <Route
          path="/home"
          element={
            user ? (
              <Layout>
                <HomeDebate />
              </Layout>
            ) : (
              <Navigate to="/login" /> // Redirige a /login si el usuario no está autenticado
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;