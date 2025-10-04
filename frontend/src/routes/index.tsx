import { createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "@/routes/PrivateRoute";
import { DefaultRoute } from "@/routes/DefaultRoute";
import { PublicRoute } from "@/routes/PublicRoute";

import { Register } from "@/pages/Register";
import { Callback } from "@/pages/Callback";
import { Login } from "@/pages/Login";
import { Home } from "@/pages/Home";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { RecoverPassword } from "@/pages/RecoverPassword";

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
          {
            element: <Callback />,
            path: "/oauth2/callback",
          },
          {
            element: <ForgotPassword />,
            path: "/forgot-password",
          },
          {
            element: <RecoverPassword />,
            path: "/recover-password/:recoverToken",
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
