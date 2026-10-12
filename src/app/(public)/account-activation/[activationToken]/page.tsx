import { AccountActivationView } from "@/features/account-activation/view";

type AccountActivationProps = {
  params: Promise<{
    activationToken: string;
  }>;
};

const AccountActivation = async ({ params }: AccountActivationProps) => {
  const { activationToken } = await params;

  return <AccountActivationView activationToken={activationToken} />;
};

export default AccountActivation;
