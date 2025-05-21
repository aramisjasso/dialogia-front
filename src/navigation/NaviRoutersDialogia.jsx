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
import SelectInterests from "../dialogia/categories/pages/SelectInterests";
import Profile from "../dialogia/profile/pages/Profile";
import AboutUs from "../dialogia/company/pages/AboutUs";
import Policies from "../dialogia/company/pages/Policies";
import RankingGlobal from "../dialogia/ranking/pages/RankingGlobal";
import ChangePassword from "@/dialogia/profile/pages/ChangePassword";
import OthersProfile from "@/dialogia/profile/pages/OthersProfile";

import Pruebas_CDAS from "../dialogia/categories/pages/PruebasCDAS";
// import ImageUploader from "../dialogia/testing/ImageUploader";
// import ParentComponent from "../dialogia/testing/ParentComponent";
// Función para crear el router (recibe el estado del usuario como parámetro)
const NaviRoutersDialogia = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute requireAuth={false}>
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
        <ProtectedRoute requireAuth={false}>
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
      path: "/aboutus",
      element: (
        <Layout>
          <AboutUs />
        </Layout>
      ),
    },
    {
      path: "/policies",
      element: (
        <Layout>
          <Policies />
        </Layout>
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
          <Layout>
            <RecoverReset />
          </Layout>
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
      path: "/select-interests",
      element: (
        <ProtectedRoute requireAuth={true} checkInterests={false}>
          <Layout>
            <SelectInterests />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute requireAuth={true} checkInterests={true}>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:username",
      element: (
        <ProtectedRoute requireAuth={true} checkInterests={true}>
          <Layout>
            <OthersProfile />
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
    {
      path: "/ranking",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <RankingGlobal />
          </Layout>
        </ProtectedRoute>
      ),
    },{
      path: "/change-password",
      element: (
        <ProtectedRoute requireAuth={true}>
          <Layout>
            <ChangePassword />
          </Layout>
        </ProtectedRoute>
      ),
    }
    // {
    //   path: "/test",
    //   element: (
    //     <ProtectedRoute requireAuth={true}>
    //       <Layout>
    //         <ParentComponent />
    //       </Layout>
    //     </ProtectedRoute>
    //   ),
    // },
  ]);
};

export default NaviRoutersDialogia;