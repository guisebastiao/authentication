import { AccountActivationResponse } from "@/features/account-activation/types";
import { HttpError } from "@/shared/lib/http/http-error";
import { httpFetch } from "@/shared/lib/http/http";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/keys";

type QueryProps = {
  activationToken: string;
};

export const useGetAccountActivation = ({ activationToken }: QueryProps) => {
  const getAccountActivation = useQuery<AccountActivationResponse, HttpError>({
    queryKey: [queryKeys.GET_ACCOUNT_ACTIVATION, activationToken],
    queryFn: async () => {
      return await httpFetch<AccountActivationResponse>({
        baseURL: window.location.origin,
        path: "/api/account-activation/:activationToken",
        paths: { activationToken },
        method: "GET",
      });
    },
    enabled: Boolean(activationToken),
    retry: false,
  });

  return getAccountActivation;
};
