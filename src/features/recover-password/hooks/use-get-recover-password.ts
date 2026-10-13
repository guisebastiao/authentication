import { RecoverPasswordResponse } from "@/features/recover-password/types";
import { HttpError } from "@/shared/lib/http/http-error";
import { httpFetch } from "@/shared/lib/http/http";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/keys";

type QueryProps = {
  recoverToken: string;
};

export const useGetRecoverPassword = ({ recoverToken }: QueryProps) => {
  const getRecoverPassword = useQuery<RecoverPasswordResponse, HttpError>({
    queryKey: [queryKeys.GET_RECOVER_PASSWORD, recoverToken],
    queryFn: async () => {
      return await httpFetch<RecoverPasswordResponse>({
        baseURL: window.location.origin,
        path: "/api/password-recovery/:recoverToken",
        paths: { recoverToken },
        method: "GET",
      });
    },
    enabled: Boolean(recoverToken),
    retry: false,
  });

  return getRecoverPassword;
};
