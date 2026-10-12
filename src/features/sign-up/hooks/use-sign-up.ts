import { AccountActivationResponse } from "@/features/account-activation/types";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { SignUpRequest } from "@/features/sign-up/types";
import { HttpError } from "@/shared/lib/http/http-error";
import { toast } from "@/shared/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { httpFetch } from "@/shared/lib/http/http";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ApiBody } from "@/shared/types/api";

type MutationVariables = {
  body: SignUpRequest;
  form: UseFormReturn<SignUpRequest>;
};

const REDIRECT_AFTER_SIGN_SUCCESS = "/account-activation";

export const useSignUp = () => {
  const router = useRouter();

  const signUp = useMutation<ApiBody<AccountActivationResponse>, HttpError, MutationVariables>({
    mutationFn: async ({ body }) => {
      return httpFetch<ApiBody<AccountActivationResponse>, SignUpRequest>({
        baseURL: window.location.origin,
        path: "/api/auth/sign-up",
        method: "POST",
        body,
      });
    },
    onSuccess: ({ data }) => {
      toast.add({
        title: "Cadastro realizado com sucesso",
        description: "Você cadastrou sua conta com sucesso.",
      });

      router.replace(`${REDIRECT_AFTER_SIGN_SUCCESS}/${data.activationToken}`);
    },
    onError: ({ data }, { form }) => {
      switch (data.code) {
        case ApiErrorCode.ACCOUNT_ALREADY_EXISTS: {
          toast.add({
            title: "Conta já registrada",
            description: "Essa email já está registrado, entre e faça o login.",
          });
          break;
        }
        case ApiErrorCode.VALIDATION_ERROR: {
          data.details?.forEach((fieldError) => {
            form.setError(fieldError.field as keyof SignUpRequest, {
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

  return { signUp };
};
