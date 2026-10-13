"use client";

import { useResendEmail } from "@/features/account-activation/hooks/use-resend-email";
import { ResendEmailRequest } from "@/features/account-activation/types";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { useTimer } from "react-timer-hook";
import { useEffect } from "react";

type ResendEmailProps = {
  activationToken: string;
  resendAvailableAt: string;
};

export const ResendEmail = ({ activationToken, resendAvailableAt }: ResendEmailProps) => {
  const { resend } = useResendEmail();

  const nextResendAvailableAt = resend.data?.resendAvailableAt;

  const { totalSeconds, seconds, minutes, hours, restart } = useTimer({
    expiryTimestamp: new Date(resendAvailableAt),
    autoStart: true,
  });

  useEffect(() => {
    if (!nextResendAvailableAt) return;

    const date = new Date(nextResendAvailableAt);

    if (Number.isNaN(date.getTime())) return;

    restart(date, true);
  }, [nextResendAvailableAt, restart]);

  const onResend = () => {
    const body: ResendEmailRequest = { activationToken };

    resend.mutate({ body });
  };

  if (totalSeconds <= 0) {
    return (
      <Button
        type="button"
        variant="link"
        className="text-foreground/75 p-0"
        onClick={onResend}
        disabled={resend.isPending}
      >
        {resend.isPending && <Spinner />}
        Reenviar e-mail
      </Button>
    );
  }

  return (
    <span className="block text-foreground/75 text-[13px] mt-2">
      Reenviar código em{" "}
      <strong>
        {hours > 0 && `${hours}h `}
        {minutes}m {String(seconds).padStart(2, "0")}s
      </strong>
    </span>
  );
};
