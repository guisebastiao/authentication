import { VerifyRecoverPasswordView } from "@/features/recover-password/view/verify-recover-password-view";

type VerifyRecoverPasswordProps = {
  params: Promise<{
    recoverToken: string;
  }>;
};

const VerifyRecoverPassword = async ({ params }: VerifyRecoverPasswordProps) => {
  const { recoverToken } = await params;

  return <VerifyRecoverPasswordView recoverToken={recoverToken} />;
};

export default VerifyRecoverPassword;
