import { createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "@/routes/PrivateRoute";
import { DefaultRoute } from "@/routes/DefaultRoute";
import { PublicRoute } from "@/routes/PublicRoute";

import { Register } from "@/pages/Register";
import { Login } from "@/pages/Login";
import { Home } from "@/pages/Home";

export const router = createBrowserRouter([
  {
    element: <DefaultRoute />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            element: <Login />,
            path: "/login",
          },
          {
            element: <Register />,
            path: "/register",
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <Home />,
            path: "/",
          },
        ],
      },
    ],
  },
]);
