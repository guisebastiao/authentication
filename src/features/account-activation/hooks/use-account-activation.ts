import { AccountActivationRequest } from "@/features/account-activation/types";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { toast } from "@/shared/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { httpFetch } from "@/shared/lib/http/http";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";

type MutationVariables = {
  body: AccountActivationRequest;
  form: UseFormReturn<AccountActivationRequest>;
};

const REDIRECT_AFTER_ACCOUNT_ACTIVATED_SUCCESS = "/sign-in";

export const useAccountActivation = () => {
  const router = useRouter();

  const accountActivation = useMutation<null, HttpError, MutationVariables>({
    mutationFn: async ({ body }) => {
      return await httpFetch<null, AccountActivationRequest>({
        baseURL: window.location.origin,
        path: "/api/account-activation",
        method: "POST",
        body,
      });
    },
    onSuccess: () => {
      toast.add({
        title: "Conta ativada com sucesso",
        description: "Você ativou sua conta com sucesso.",
      });

      router.replace(REDIRECT_AFTER_ACCOUNT_ACTIVATED_SUCCESS);
    },
    onError: ({ data }, { form }) => {
      switch (data.code) {
        case ApiErrorCode.INCORRECT_OTP: {
          form.setError("otpCode" as keyof AccountActivationRequest, {
            type: "server",
            message: "Código OTP está inválido.",
          });

          break;
        }
        case ApiErrorCode.VALIDATION_ERROR: {
          data.details?.forEach((fieldError) => {
            form.setError(fieldError.field as keyof AccountActivationRequest, {
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

  return { accountActivation };
};
