"use client";

import { useGetRecoverPassword } from "@/features/recover-password/hooks/use-get-recover-password";
import { Content } from "@/features/recover-password/components/content";
import { AsyncBoundary } from "@/shared/components/async-boundary";

type VerifyRecoverPasswordViewProps = {
  recoverToken: string;
};

export const VerifyRecoverPasswordView = ({ recoverToken }: VerifyRecoverPasswordViewProps) => {
  const { data, isLoading, error } = useGetRecoverPassword({ recoverToken });

  return (
    <AsyncBoundary data={data} isLoading={isLoading} error={error?.data}>
      {(data) => <Content data={data} />}
    </AsyncBoundary>
  );
};
