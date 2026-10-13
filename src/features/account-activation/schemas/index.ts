import { z } from "zod";

export const accountActivationSchema = z.object({
  activationToken: z.string(),
  otpCode: z
    .string()
    .min(1, { message: "Informe o código OTP" })
    .regex(/.*^\d{6}$.*/, { message: "Código OTP inválido" }),
});
