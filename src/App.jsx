// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout"; // Importa el Layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Home no usa Layout (no muestra NavTab) */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
          
          } />

        {/* Register y Login usan Layout (muestran NavTab) */}
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;