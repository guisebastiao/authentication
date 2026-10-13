"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { InputPassword } from "@/shared/components/input-password";
import { useSignUp } from "@/features/sign-up/hooks/use-sign-up";
import { Separator } from "@/shared/components/ui/separator";
import { InputEmail } from "@/shared/components/input-email";
import { signUpSchema } from "@/features/sign-up/schemas";
import { Spinner } from "@/shared/components/ui/spinner";
import { SignUpRequest } from "@/features/sign-up/types";
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

export const SignUpView = () => {
  const { signUp } = useSignUp();

  const router = useRouter();

  const form = useForm<SignUpRequest>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (body: SignUpRequest) => {
    signUp.mutate({ body, form });
  };

  return (
    <Card className="sm:max-w-xl not-sm:ring-0 not-sm:px-1 w-full mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Criar Conta</CardTitle>
        <CardDescription>Preencha os dados abaixo para criar sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={signUp.isPending || signUp.isPending}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-form-email">E-mail</FieldLabel>
                    <InputEmail
                      {...field}
                      id="sign-up-form-email"
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
                    <FieldLabel htmlFor="sign-up-form-password">Senha</FieldLabel>
                    <InputPassword
                      {...field}
                      id="sign-up-form-password"
                      placeholder="Informe sua senha"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-form-confirm-password">Confirmar Senha</FieldLabel>
                    <InputPassword
                      {...field}
                      id="sign-up-form-confirm-password"
                      placeholder="Confirme sua senha"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="flex justify-center items-center gap-2 mt-4">
              <Separator />
              <span className="text-[13px] font-medium text-foreground/60">OU</span>
              <Separator />
            </div>
            <div className="flex items-center justify-center gap-1 mt-2.25">
              <span className="text-foreground/70">Já tem uma conta?</span>
              <Button
                variant="link"
                className="text-foreground px-0"
                type="button"
                onClick={() => router.push("/sign-in")}
              >
                Entrar
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
      <CardFooter className="not-sm:bg-transparent not-sm:border-t-0">
        <Button form="sign-up-form" type="submit" className="w-full" disabled={signUp.isPending}>
          {signUp.isPending && <Spinner />}
          <span>Criar conta</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
