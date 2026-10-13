import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { toast } from "@/shared/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { httpFetch } from "@/shared/lib/http/http";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  CreateRecoverPasswordRequest,
  RecoverPasswordResponse,
} from "@/features/recover-password/types";

type MutationVariables = {
  body: CreateRecoverPasswordRequest;
  form: UseFormReturn<CreateRecoverPasswordRequest>;
};

const REDIRECT_AFTER_SEND_EMAIL_SUCCESS = "/password-recovery/verify";

export const useCreateRecoverPassword = () => {
  const router = useRouter();

  const createRecoverPassword = useMutation<RecoverPasswordResponse, HttpError, MutationVariables>({
    mutationFn: async ({ body }) => {
      return await httpFetch<RecoverPasswordResponse, CreateRecoverPasswordRequest>({
        baseURL: window.location.origin,
        path: "/api/password-recovery",
        method: "POST",
        body,
      });
    },
    onSuccess: ({ recoverToken }) => {
      toast.add({
        title: "E-mail enviado",
        description: "Você receberá um código de verificação no e-mail informado.",
      });

      router.replace(`${REDIRECT_AFTER_SEND_EMAIL_SUCCESS}/${recoverToken}`);
    },
    onError: ({ data }, { form }) => {
      switch (data.code) {
        case ApiErrorCode.VALIDATION_ERROR: {
          data.details?.forEach((fieldError) => {
            form.setError(fieldError.field as keyof CreateRecoverPasswordRequest, {
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

  return { createRecoverPassword };
};
