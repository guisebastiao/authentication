import { useVerifyRecoverPassword } from "@/features/recover-password/hooks/use-verify-recover-password";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { ResendEmail } from "@/features/recover-password/components/resend-email";
import { ContentInfo } from "@/features/recover-password/components/content-info";
import { verifyRecoverPasswordSchema } from "@/features/recover-password/schemas";
import { Field, FieldError, FieldGroup } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  RecoverPasswordResponse,
  VerifyRecoverPasswordRequest,
} from "@/features/recover-password/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";

type ContentProps = {
  data: RecoverPasswordResponse;
};

const OTP_SIZE = 6;

export const Content = ({ data }: ContentProps) => {
  const { verifyRecoverPassword } = useVerifyRecoverPassword();

  const form = useForm<VerifyRecoverPasswordRequest>({
    resolver: zodResolver(verifyRecoverPasswordSchema),
    defaultValues: {
      recoverToken: data.recoverToken,
      otpCode: "",
    },
  });

  const onSubmit = (body: VerifyRecoverPasswordRequest) => {
    verifyRecoverPassword.mutate({ body, form });
  };

  return (
    <Card className="sm:max-w-xl not-sm:ring-0 not-sm:px-1 w-full mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Verifique seu e-mail</CardTitle>
        <CardDescription>
          Digite o código enviado para o seu e-mail, para verificar a troca de senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContentInfo email={data.email} expiresAt={data.expiresAt} />
        <form id="account-activation-form" onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={verifyRecoverPassword.isPending}>
            <FieldGroup>
              <Controller
                name="otpCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputOTP maxLength={OTP_SIZE} {...field}>
                      <InputOTPGroup>
                        {Array.from({ length: OTP_SIZE }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </fieldset>
        </form>
        <ResendEmail recoverToken={data.recoverToken} resendAvailableAt={data.resendAvailableAt} />
      </CardContent>
      <CardFooter className="not-sm:bg-transparent not-sm:border-t-0">
        <Button
          form="account-activation-form"
          type="submit"
          className="w-full"
          disabled={verifyRecoverPassword.isPending}
        >
          {verifyRecoverPassword.isPending && <Spinner />}
          <span>Verificar</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
