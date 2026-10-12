import { useSignIn } from "@/features/sign-in/hooks/use-sign-in";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "@/shared/components/ui/toast";

export const useGoogleSignIn = () => {
  const { googleSignIn } = useSignIn();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: ({ code }) => {
      googleSignIn.mutate({ code });
    },
    onError: () => {
      toast.add({
        title: "Falha ao entrar com Google",
        description: "Não foi possível concluir a autenticação. Tente novamente.",
      });
    },
  });

  return { googleLogin };
};
