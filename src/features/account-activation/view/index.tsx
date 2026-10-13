"use client";

import { useGetAccountActivation } from "@/features/account-activation/hooks/use-get-account-activation";
import { Content } from "@/features/account-activation/components/content";
import { AsyncBoundary } from "@/shared/components/async-boundary";

type AccountActivationViewProps = {
  activationToken: string;
};

export const AccountActivationView = ({ activationToken }: AccountActivationViewProps) => {
  const { data, isLoading, error } = useGetAccountActivation({ activationToken });

  return (
    <AsyncBoundary data={data} isLoading={isLoading} error={error?.data}>
      {(data) => <Content data={data} />}
    </AsyncBoundary>
  );
};
