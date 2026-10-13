import { AccountActivationResponse, ResendEmailRequest } from "@/features/account-activation/types";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { toast } from "@/shared/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { httpFetch } from "@/shared/lib/http/http";

type MutationVariables = {
  body: ResendEmailRequest;
};

export const useResendEmail = () => {
  const resend = useMutation<AccountActivationResponse, HttpError, MutationVariables>({
    mutationFn: async ({ body }) => {
      return await httpFetch<AccountActivationResponse, ResendEmailRequest>({
        baseURL: window.location.origin,
        path: "/api/account-activation/resend",
        method: "POST",
        body,
      });
    },
    onSuccess: ({ email }) => {
      toast.add({
        title: "E-mail reenviado",
        description: `E-mail foi reenviado para ${email}.`,
      });
    },
    onError: ({ data }) => {
      switch (data.code) {
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

  return { resend };
};
