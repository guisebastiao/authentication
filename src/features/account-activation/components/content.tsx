import { useAccountActivation } from "@/features/account-activation/hooks/use-account-activation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { accountActivationSchema } from "@/features/account-activation/schemas";
import { Field, FieldError, FieldGroup } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import {
  AccountActivationRequest,
  AccountActivationResponse,
} from "@/features/account-activation/types";
import { ContentInfo } from "@/features/account-activation/components/content-info";
import { ResendEmail } from "@/features/account-activation/components/resend-email";

type ContentProps = {
  data: AccountActivationResponse;
};

const OTP_SIZE = 6;

export const Content = ({ data }: ContentProps) => {
  const { accountActivation } = useAccountActivation();

  const form = useForm<AccountActivationRequest>({
    resolver: zodResolver(accountActivationSchema),
    defaultValues: {
      activationToken: data.activationToken,
      otpCode: "",
    },
  });

  const onSubmit = (body: AccountActivationRequest) => {
    accountActivation.mutate({ body, form });
  };

  return (
    <Card className="sm:max-w-xl not-sm:ring-0 not-sm:px-1 w-full mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Verifique seu e-mail</CardTitle>
        <CardDescription>Digite o código enviado para o seu e-mail.</CardDescription>
      </CardHeader>
      <CardContent>
        <ContentInfo email={data.email} expiresAt={data.expiresAt} />
        <form id="account-activation-form" onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={accountActivation.isPending}>
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
        <ResendEmail
          activationToken={data.activationToken}
          resendAvailableAt={data.resendAvailableAt}
        />
      </CardContent>
      <CardFooter className="not-sm:bg-transparent not-sm:border-t-0">
        <Button
          form="account-activation-form"
          type="submit"
          className="w-full"
          disabled={accountActivation.isPending}
        >
          {accountActivation.isPending && <Spinner />}
          <span>Verificar e criar conta</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
