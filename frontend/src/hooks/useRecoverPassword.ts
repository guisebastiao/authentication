import type { CreateRecoverPasswordRequest, RecoverPasswordRequest } from "@/types/api/recoverPassword";
import { recoverPasswordService } from "@/services/recoverPasswordService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRecoverPassword = () => {
  const createRecoverPassword = () => {
    return useMutation({
      mutationFn: (data: CreateRecoverPasswordRequest) => recoverPasswordService.createRecoverPassword(data),
      onError(error: Error) {
        toast.error(error.message);
      },
      onSuccess(data) {
        toast.success(data.message);
      },
    });
  };

  const recoverPassword = () => {
    return useMutation({
      mutationFn: (data: { recoverToken: string; data: RecoverPasswordRequest }) => recoverPasswordService.recoverPassword(data),
      onError(error: Error) {
        toast.error(error.message);
      },
      onSuccess(data) {
        toast.success(data.message);
      },
    });
  };

  return { createRecoverPassword, recoverPassword };
};
