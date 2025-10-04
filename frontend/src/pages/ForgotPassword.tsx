import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { CreateRecoverPasswordRequest } from "@/types/api/recoverPassword";
import { createRecoverPasswordSchema } from "@/schema/recoverPasswordSchema";
import { useRecoverPassword } from "@/hooks/useRecoverPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export const ForgotPassword = () => {
  const { createRecoverPassword } = useRecoverPassword();

  const createRecoverPasswordForm = useForm<CreateRecoverPasswordRequest>({
    resolver: zodResolver(createRecoverPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = createRecoverPassword();

  const handleCreateRecoverPassword = () => {
    mutate(createRecoverPasswordForm.getValues(), {
      onSuccess: () => {
        createRecoverPasswordForm.reset();
      },
    });
  };

  return (
    <Form {...createRecoverPasswordForm}>
      <form onSubmit={createRecoverPasswordForm.handleSubmit(handleCreateRecoverPassword)} className="max-w-lg flex-1 space-y-4 content-center self-center mx-auto">
        <h1 className="text-2xl font-bold leading-relaxed text-center">Recuperar Senha</h1>
        <p className="text-sm text-center text-foreground">Informe o e-mail cadastrado em sua conta e enviaremos um link para redefinir sua senha</p>
        <FormField
          control={createRecoverPasswordForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Digite seu email" autoComplete="off" {...field} />
              </FormControl>
              {createRecoverPasswordForm.formState.errors.email && <FormMessage>{createRecoverPasswordForm.formState.errors.email.message}</FormMessage>}
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
