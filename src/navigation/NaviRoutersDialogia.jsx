// src/router.js
import { createBrowserRouter, Outlet } from "react-router-dom";
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
import RegisterInLogin from "../dialogia/login/pages/RegisterInLogin";
import RecommendView from '../dialogia/views debate/RecommendView'
import Debate from '../dialogia/debate/Debate';
import Category from "../dialogia/categories/pages/Category";
import Search from "../dialogia/search/pages/Search";


import Pruebas_CDAS from "../dialogia/categories/pages/PruebasCDAS";
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
      path: "/registeruser",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <RegisterInLogin />
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
      path: "debate/:id",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <Debate />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/Pruebas_CDAS",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Layout>
            <Pruebas_CDAS />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/categories",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <Categories />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/category/:id",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <Category />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/search",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <Search />
          </Layout>
        </ProtectedRoute>
      ),
    },
  ]);
};

export default NaviRoutersDialogia;