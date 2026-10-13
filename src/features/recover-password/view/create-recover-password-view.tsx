"use client";

import { useCreateRecoverPassword } from "@/features/recover-password/hooks/use-create-recover-password copy";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { createRecoverPasswordSchema } from "@/features/recover-password/schemas";
import { CreateRecoverPasswordRequest } from "@/features/recover-password/types";
import { InputEmail } from "@/shared/components/input-email";
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

export const CreateRecoverPasswordView = () => {
  const { createRecoverPassword } = useCreateRecoverPassword();

  const form = useForm<CreateRecoverPasswordRequest>({
    resolver: zodResolver(createRecoverPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (body: CreateRecoverPasswordRequest) => {
    createRecoverPassword.mutate({ body, form });
  };

  return (
    <Card className="sm:max-w-xl not-sm:ring-0 not-sm:px-1 w-full mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Informe seu e-mail</CardTitle>
        <CardDescription>
          Informe o e-mail associado à sua conta. Enviaremos um código de verificação para que você
          possa redefinir sua senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={createRecoverPassword.isPending}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-password-form-email">E-mail</FieldLabel>
                    <InputEmail
                      {...field}
                      id="forgot-password-form-email"
                      placeholder="Informe seu e-mail"
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
          form="forgot-password-form"
          type="submit"
          className="w-full"
          disabled={createRecoverPassword.isPending}
        >
          {createRecoverPassword.isPending && <Spinner />}
          <span>Enviar e-mail</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
