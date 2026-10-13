"use client";

import { useTimer } from "react-timer-hook";

type ContentInfoProps = {
  email: string;
  expiresAt: string;
};

export const ContentInfo = ({ email, expiresAt }: ContentInfoProps) => {
  const { totalSeconds, seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(expiresAt),
    autoStart: true,
  });

  if (totalSeconds <= 0) {
    return null;
  }

  const className = "block text-foreground/75 text-[13px]";

  return (
    <div className="space-y-1 mb-3">
      <span className={className}>
        Código enviado para <strong>{email}</strong>
      </span>
      <span className={className}>
        O código expira em{" "}
        <strong>
          {hours > 0 && `${hours}h `}
          {minutes}m {String(seconds).padStart(2, "0")}s
        </strong>
      </span>
    </div>
  );
};
