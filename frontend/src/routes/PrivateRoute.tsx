import { useContextAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { isAuthenticated } = useContextAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
