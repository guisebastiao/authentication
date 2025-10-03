import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useContextAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginRequest } from "@/types/api/auth";
import { loginSchema } from "@/schema/authSchema";
import GoogleIcon from "@/assets/google_icon.svg";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

export const Login = () => {
  const { setAuthenticated } = useContextAuth();
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = login();

  const handleLogin = () => {
    mutate(loginForm.getValues(), {
      onSuccess: () => {
        setAuthenticated(true);
      },
    });
  };

  const handleLoginGoogle = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open("http://localhost:8080/oauth2/authorization/google", "Social Login", `width=${width},height=${height},left=${left},top=${top}`);
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="max-w-lg flex-1 space-y-4 content-center self-center mx-auto">
        <h1 className="text-2xl font-bold leading-relaxed text-center">Entrar</h1>
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Digite seu email" autoComplete="off" {...field} />
              </FormControl>
              {loginForm.formState.errors.email && <FormMessage>{loginForm.formState.errors.email.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua senha" autoComplete="off" {...field} />
              </FormControl>
              {loginForm.formState.errors.password && <FormMessage>{loginForm.formState.errors.password.message}</FormMessage>}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner spinnerSize="sm" className="text-background" />}
          <span>{isPending ? "Entrando" : "Entrar"}</span>
        </Button>
        <Button variant="secondary" type="button" className="w-full" disabled={isPending} onClick={() => navigate("/register")}>
          <span>Criar minha conta</span>
        </Button>
        <div className="flex items-center justify-center overflow-hidden gap-2">
          <Separator />
          <span className="text-xs text-muted-foreground">OU</span>
          <Separator />
        </div>
        <Button variant="ghost" type="button" className="w-full border" disabled={isPending} onClick={handleLoginGoogle}>
          <img alt="G" src={GoogleIcon} className="size-4.5" />
          <span>
            <span>Entrar com Google</span>
          </span>
        </Button>
      </form>
    </Form>
  );
};
