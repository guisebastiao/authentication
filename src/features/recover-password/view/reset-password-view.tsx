"use client";

import { useResetPassword } from "@/features/recover-password/hooks/use-reset-recover-password";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { resetPasswordSchema } from "@/features/recover-password/schemas";
import { ResetPasswordRequest } from "@/features/recover-password/types";
import { InputPassword } from "@/shared/components/input-password";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type ResetPasswordViewProps = {
  recoverToken: string;
};

export const ResetPasswordView = ({ recoverToken }: ResetPasswordViewProps) => {
  const { resetPassword } = useResetPassword();

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      recoverToken,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (body: ResetPasswordRequest) => {
    resetPassword.mutate({ body, form });
  };

  return (
    <Card className="sm:max-w-xl not-sm:ring-0 not-sm:px-1 w-full mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recuperar senha</CardTitle>
        <CardDescription>
          Crie uma nova senha para sua conta. Escolha uma senha forte e segura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={resetPassword.isPending}>
            <FieldGroup>
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-password-form-new-password">Nova senha</FieldLabel>
                    <InputPassword
                      {...field}
                      id="reset-password-form-new-password"
                      placeholder="Informe sua nova senha"
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
                    <FieldLabel htmlFor="reset-password-form-confirm-password">
                      Confirmar senha
                    </FieldLabel>
                    <InputPassword
                      {...field}
                      id="reset-password-form-confirm-password"
                      placeholder="Confirme sua nova senha"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>
      <CardFooter className="not-sm:bg-transparent not-sm:border-t-0">
        <Button
          form="reset-password-form"
          type="submit"
          className="w-full"
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending && <Spinner />}
          <span>Recuperar senha</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
