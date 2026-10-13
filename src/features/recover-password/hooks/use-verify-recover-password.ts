import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { toast } from "@/shared/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { httpFetch } from "@/shared/lib/http/http";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  RecoverPasswordResponse,
  VerifyRecoverPasswordRequest,
} from "@/features/recover-password/types";

type MutationVariables = {
  body: VerifyRecoverPasswordRequest;
  form: UseFormReturn<VerifyRecoverPasswordRequest>;
};

const REDIRECT_AFTER_VERIFIED_SUCCESS = "/password-recovery/reset";

export const useVerifyRecoverPassword = () => {
  const router = useRouter();

  const verifyRecoverPassword = useMutation<RecoverPasswordResponse, HttpError, MutationVariables>({
    mutationFn: async ({ body }) => {
      return await httpFetch<RecoverPasswordResponse, VerifyRecoverPasswordRequest>({
        baseURL: window.location.origin,
        path: "/api/password-recovery/verify",
        method: "POST",
        body,
      });
    },
    onSuccess: ({ recoverToken }) => {
      router.replace(`${REDIRECT_AFTER_VERIFIED_SUCCESS}/${recoverToken}`);
    },
    onError: ({ data }, { form }) => {
      switch (data.code) {
        case ApiErrorCode.INCORRECT_OTP: {
          form.setError("otpCode" as keyof VerifyRecoverPasswordRequest, {
            type: "server",
            message: "Código OTP está inválido.",
          });

          break;
        }
        case ApiErrorCode.VALIDATION_ERROR: {
          data.details?.forEach((fieldError) => {
            form.setError(fieldError.field as keyof VerifyRecoverPasswordRequest, {
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

  return { verifyRecoverPassword };
};
