import { createBrowserRouter } from "react-router-dom";
import Home from "../dialogia/home/pages/Home";
import Categories from "../dialogia/categories/pages/Categories";

import Error from "../share/errors/pages/Error";
const router = createBrowserRouter([  
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />,
      children: [
        {
          path: "/categories",
          element: <Categories />,
        }
      ], 
    }
  ]);
  export default router;