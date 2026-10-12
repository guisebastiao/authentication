"use client";

type AccountActivationViewProps = {
  activationToken: string;
};

export const AccountActivationView = ({ activationToken }: AccountActivationViewProps) => {
  return <h1>{activationToken}</h1>;
};
