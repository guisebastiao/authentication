import { ResetPasswordView } from "@/features/recover-password/view/reset-password-view";

type ResetPasswordProps = {
  params: Promise<{
    recoverToken: string;
  }>;
};

const ResetPassword = async ({ params }: ResetPasswordProps) => {
  const { recoverToken } = await params;

  return <ResetPasswordView recoverToken={recoverToken} />;
};

export default ResetPassword;
