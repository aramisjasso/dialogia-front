// src/components/Layout.jsx
import React from "react";
import NavTab from "./Navtab";

const Layout = ({ children }) => {
  return (
    <>
      <NavTab /> {/* Muestra el NavTab */}
      {children} {/* Muestra el contenido de la página */}
    </>
  );
};

export default Layout;