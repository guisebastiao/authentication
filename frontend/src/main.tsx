import { QueryProvider } from "@/context/QueryContext";
import { AuthProvider } from "@/context/AuthContext";
import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { router } from "@/routes";
import { Toaster } from "sonner";
import "@/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster theme="dark" />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
