import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { RecoverPasswordRequest } from "@/types/api/recoverPassword";
import { recoverPasswordSchema } from "@/schema/recoverPasswordSchema";
import { useRecoverPassword } from "@/hooks/useRecoverPassword";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export const RecoverPassword = () => {
  const { recoverToken } = useParams();

  if (!recoverToken) return;

  const { recoverPassword } = useRecoverPassword();
  const navigate = useNavigate();

  const recoverPasswordForm = useForm<RecoverPasswordRequest>({
    resolver: zodResolver(recoverPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = recoverPassword();

  const handleRecoverPassword = () => {
    mutate(
      { recoverToken, data: recoverPasswordForm.getValues() },
      {
        onSuccess: () => {
          navigate("/login");
        },
      }
    );
  };

  return (
    <Form {...recoverPasswordForm}>
      <form onSubmit={recoverPasswordForm.handleSubmit(handleRecoverPassword)} className="max-w-lg flex-1 space-y-4 content-center self-center mx-auto">
        <h1 className="text-2xl font-bold leading-relaxed text-center">Redefinir Senha</h1>
        <FormField
          control={recoverPasswordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua nova senha" autoComplete="off" {...field} />
              </FormControl>
              {recoverPasswordForm.formState.errors.newPassword && <FormMessage>{recoverPasswordForm.formState.errors.newPassword.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={recoverPasswordForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirme sua senha" autoComplete="off" {...field} />
              </FormControl>
              {recoverPasswordForm.formState.errors.confirmPassword && <FormMessage>{recoverPasswordForm.formState.errors.confirmPassword.message}</FormMessage>}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner spinnerSize="sm" className="text-background" />}
          <span>{isPending ? "Enviando" : "Enviar"}</span>
        </Button>
      </form>
    </Form>
  );
};
