// src/router.js
import { createBrowserRouter } from "react-router-dom";
import Error from "../share/errors/components/Error";
import Register from "../dialogia/register/pages/Register";
import Login from "../dialogia/login/pages/Login";
import Recover from "../dialogia/recover/pages/Recover";
import RecoverReset from "../dialogia/recover/pages/RecoverReset";
import Home from "../dialogia/home/pages/Home";
import Layout from "../share/components/Layout"; // Importa el Layout
import ProtectedRoute from "./ProtectedRoute";
import Root from "../dialogia/root/pages/Root";
import Categories from "../dialogia/categories/pages/Categories";
import Category from "../dialogia/categories/pages/Category";


// Función para crear el router (recibe el estado del usuario como parámetro)
const NaviRoutersDialogia = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute  requireAuth={false}>
          <Layout>
            <Root /> {/* Renderiza Root si el usuario no está autenticado */}
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: (
        <Layout>
          <Error />
        </Layout>
      ),
    },
    {
      path: "/register",
      element: (
        <ProtectedRoute  requireAuth={false}>
          <Layout>
            <Register />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Layout>
            <Login />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/recover",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Layout>
            <Recover />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/recover-reset",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Layout>
            <RecoverReset />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/categories",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Layout>
            <Categories />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/category",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Layout>
            <Category />
          </Layout>
        </ProtectedRoute>
      ),
    },
  ]);
};

export default NaviRoutersDialogia;