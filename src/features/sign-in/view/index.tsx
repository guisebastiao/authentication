"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { useGoogleSignIn } from "@/features/sign-in/hooks/use-google-login";
import { InputPassword } from "@/shared/components/input-password";
import { useSignIn } from "@/features/sign-in/hooks/use-sign-in";
import { Separator } from "@/shared/components/ui/separator";
import { InputEmail } from "@/shared/components/input-email";
import { GoogleIcon } from "@/shared/components/google-icon";
import { signInSchema } from "@/features/sign-in/schemas";
import { SignInRequest } from "@/features/sign-in/types";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const SignInView = () => {
  const { googleLogin } = useGoogleSignIn();
  const { signIn, googleSignIn } = useSignIn();

  const router = useRouter();

  const form = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (body: SignInRequest) => {
    signIn.mutate({ body, form });
  };

  return (
    <Card className="sm:max-w-xl not-sm:ring-0 not-sm:px-1 w-full mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Entrar</CardTitle>
        <CardDescription>Faça login para acessar sua conta, ou entre com o Google.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={signIn.isPending || googleSignIn.isPending}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-in-form-email">E-mail</FieldLabel>
                    <InputEmail
                      {...field}
                      id="sign-in-form-email"
                      placeholder="Informe seu e-mail"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-in-form-password">Senha</FieldLabel>
                    <InputPassword
                      {...field}
                      id="sign-in-form-password"
                      placeholder="Informe sua senha"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              variant="link"
              className="mr-0 mt-3 text-foreground/75"
              type="button"
              onClick={() => router.push("/forgot")}
            >
              Esqueci minha senha
            </Button>
            <div className="flex justify-center items-center gap-2">
              <Separator />
              <span className="text-[13px] font-medium text-foreground/60">OU</span>
              <Separator />
            </div>
            <div className="space-y-3 mt-5">
              <div className="space-y-2 flex justify-center">
                <Button variant="outline" className="w-full" type="button" onClick={googleLogin}>
                  {googleSignIn.isPending ? <Spinner /> : <GoogleIcon className="size-4.25" />}
                  <span>Entrar com Google</span>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-foreground/70">Não tem uma conta?</span>
                <Button
                  variant="link"
                  className="text-foreground px-0"
                  type="button"
                  onClick={() => router.push("/sign-up")}
                >
                  Cadastre-se
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </CardContent>
      <CardFooter className="not-sm:bg-transparent not-sm:border-t-0">
        <Button
          form="sign-in-form"
          type="submit"
          className="w-full"
          disabled={signIn.isPending || googleSignIn.isPending}
        >
          {signIn.isPending && <Spinner />}
          <span>Entrar</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
