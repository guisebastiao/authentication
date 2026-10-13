import { ResetPasswordRequest } from "@/features/recover-password/types";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { toast } from "@/shared/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { httpFetch } from "@/shared/lib/http/http";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";

type MutationVariables = {
  body: ResetPasswordRequest;
  form: UseFormReturn<ResetPasswordRequest>;
};

const REDIRECT_AFTER_RESETED_SUCCESS = "/sign-in";

export const useResetPassword = () => {
  const router = useRouter();

  const resetPassword = useMutation<null, HttpError, MutationVariables>({
    mutationFn: async ({ body }) => {
      return await httpFetch<null, ResetPasswordRequest>({
        baseURL: window.location.origin,
        path: "/api/password-recovery/reset",
        method: "PATCH",
        body,
      });
    },
    onSuccess: () => {
      toast.add({
        title: "Senha recuperada",
        description: "Sua senha foi recuperada com sucesso.",
      });

      router.replace(REDIRECT_AFTER_RESETED_SUCCESS);
    },
    onError: ({ data }, { form }) => {
      switch (data.code) {
        case ApiErrorCode.VALIDATION_ERROR: {
          data.details?.forEach((fieldError) => {
            form.setError(fieldError.field as keyof ResetPasswordRequest, {
              message: fieldError.code,
            });
          });

          break;
        }
        case ApiErrorCode.TIMEOUT_ERROR: {
          toast.add({
            title: "Tempo excedido",
            description: "Tempo de conexão esgotado. Tente novamente.",
          });

          break;
        }
        default: {
          toast.add({
            title: "Algo deu errado",
          });
        }
      }
    },
  });

  return { resetPassword };
};
