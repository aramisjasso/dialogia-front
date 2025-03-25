// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
// import createAppRouter from "./router";

import NaviRoutersDialogia from "./navigation/NaviRoutersDialogia" 


function App() {

    const router = NaviRoutersDialogia();
  return (
    <>
    <RouterProvider router={router} />
    
    </>
  );
}

export default App;