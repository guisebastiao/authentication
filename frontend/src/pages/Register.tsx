import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { RegisterRequest } from "@/types/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/authSchema";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = register();

  const handleLogin = () => {
    mutate(registerForm.getValues(), {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(handleLogin)} className="max-w-lg flex-1 space-y-4 content-center self-center mx-auto">
        <h1 className="text-2xl font-bold leading-relaxed text-center">Cadastrar</h1>
        <FormField
          control={registerForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Digite seu nome" autoComplete="off" {...field} />
              </FormControl>
              {registerForm.formState.errors.name && <FormMessage>{registerForm.formState.errors.name.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Digite seu email" autoComplete="off" {...field} />
              </FormControl>
              {registerForm.formState.errors.email && <FormMessage>{registerForm.formState.errors.email.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua senha" autoComplete="off" {...field} />
              </FormControl>
              {registerForm.formState.errors.password && <FormMessage>{registerForm.formState.errors.password.message}</FormMessage>}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner spinnerSize="sm" className="text-background" />}
          <span>{isPending ? "Cadastrando" : "Cadastrar"}</span>
        </Button>
        <Button variant="secondary" type="button" className="w-full" disabled={isPending} onClick={() => navigate("/login")}>
          <span>Entrar na minha conta</span>
        </Button>
      </form>
    </Form>
  );
};
