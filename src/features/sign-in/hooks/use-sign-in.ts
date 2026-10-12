import { GoogleSignInRequest, SignInRequest, SignInResponse } from "@/features/sign-in/types";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { toast } from "@/shared/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { httpFetch } from "@/shared/lib/http/http";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";

type MutationVariables = {
  body: SignInRequest;
  form: UseFormReturn<SignInRequest>;
};

const REDIRECT_AFTER_SIGN_SUCCESS = "/";

export const useSignIn = () => {
  const router = useRouter();

  const signIn = useMutation<SignInResponse, HttpError, MutationVariables>({
    mutationFn: async ({ body }) => {
      return httpFetch<SignInResponse, SignInRequest>({
        baseURL: window.location.origin,
        path: "/api/auth/sign-in",
        method: "POST",
        body,
      });
    },
    onSuccess: () => {
      toast.add({
        title: "Login realizado com sucesso",
        description: "Você entrou na sua conta com sucesso.",
      });

      router.replace(REDIRECT_AFTER_SIGN_SUCCESS);
    },
    onError: ({ data }, { form }) => {
      switch (data.code) {
        case ApiErrorCode.ACCOUNT_INVALID_CREDENTIALS: {
          toast.add({
            title: "Erro",
            description: "E-mail ou senha incorretos.",
          });
          break;
        }
        case ApiErrorCode.VALIDATION_ERROR: {
          data.details?.forEach((fieldError) => {
            form.setError(fieldError.field as keyof SignInRequest, {
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

  const googleSignIn = useMutation<SignInResponse, HttpError, GoogleSignInRequest>({
    mutationFn: async (body: GoogleSignInRequest) => {
      return httpFetch<SignInResponse, GoogleSignInRequest>({
        baseURL: window.location.origin,
        path: "/api/auth/sign-in",
        method: "POST",
        body,
      });
    },
    onSuccess: () => {
      toast.add({
        title: "Login realizado com sucesso",
        description: "Você entrou na sua conta com sucesso.",
      });

      router.replace(REDIRECT_AFTER_SIGN_SUCCESS);
    },
    onError: ({ data }) => {
      switch (data.code) {
        case ApiErrorCode.ACCOUNT_INVALID_CREDENTIALS: {
          toast.add({
            title: "Erro",
            description: "E-mail ou senha incorretos.",
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

  return { signIn, googleSignIn };
};
