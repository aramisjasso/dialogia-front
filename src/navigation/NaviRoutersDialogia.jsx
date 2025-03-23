// src/router.js
import { createBrowserRouter } from "react-router-dom";
import Error from "../share/errors/components/Error";
import Register from "../dialogia/register/pages/Register";
import Login from "../dialogia/login/pages/Login";
import Home from "../dialogia/home/pages/Home";
import Layout from "../share/components/Layout"; // Importa el Layout
import ProtectedRoute from "./ProtectedRoute";
import Root from "../dialogia/root/pages/Root";
import Footer from "../share/footer/Footer";

// Función para crear el router (recibe el estado del usuario como parámetro)
const NaviRoutersDialogia = (user) => {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute user={user} requireAuth={false}>
          <Layout>
            <Root /> {/* Renderiza Root si el usuario no está autenticado */}
            <Footer/>
          </Layout>
          
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/register",
      element: (
        <ProtectedRoute user={user} requireAuth={false}>
          <Layout>
            <Register />
            <Footer/>
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute user={user} requireAuth={false}>
          <Layout>
            <Login />
            <Footer/>
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute user={user} requireAuth={true}>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      ),
    },
  ]);
};

export default NaviRoutersDialogia;