import type { LoginRequest, RegisterRequest } from "@/types/api/auth";
import { authService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAuth = () => {
  const login = () => {
    return useMutation({
      mutationFn: (data: LoginRequest) => authService.login(data),
      onError(error: Error) {
        toast.error(error.message);
      },
      onSuccess(data) {
        toast.success(data.message);
      },
    });
  };

  const register = () => {
    return useMutation({
      mutationFn: (data: RegisterRequest) => authService.register(data),
      onError(error: Error) {
        toast.error(error.message);
      },
      onSuccess(data) {
        toast.success(data.message);
      },
    });
  };

  const logout = () => {
    return useMutation({
      mutationFn: () => authService.logout(),
      onError(error: Error) {
        toast.error(error.message);
      },
      onSuccess(data) {
        toast.success(data.message);
      },
    });
  };

  return { login, register, logout };
};
