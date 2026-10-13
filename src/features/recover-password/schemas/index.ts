import { z } from "zod";

export const verifyRecoverPasswordSchema = z.object({
  recoverToken: z.string(),
  otpCode: z
    .string()
    .min(1, { message: "Informe o código OTP" })
    .regex(/.*^\d{6}$.*/, { message: "Código OTP inválido" }),
});

export const createRecoverPasswordSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, { message: "Informe o email" })
    .max(255, { message: "O email deve ter no máximo 255 caracteres" }),
});

export const resetPasswordSchema = z
  .object({
    recoverToken: z.string(),
    newPassword: z
      .string()
      .min(1, { message: "Informe a nova senha" })
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" })
      .regex(/.*[!@#$%&*].*/, {
        message: "A senha deve conter pelo menos um caractere especial",
      })
      .regex(/.*\d.*\d.*/, {
        message: "A senha deve conter pelo menos dois dígitos",
      })
      .regex(/.*[A-Z].*/, {
        message: "A senha deve conter pelo menos uma letra maiúscula",
      })
      .regex(/.*[a-z].*/, {
        message: "A senha deve conter pelo menos uma letra minúscula",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirme sua nova senha" })
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" })
      .regex(/.*[!@#$%&*].*/, {
        message: "A senha deve conter pelo menos um caractere especial",
      })
      .regex(/.*\d.*\d.*/, {
        message: "A senha deve conter pelo menos dois dígitos",
      })
      .regex(/.*[A-Z].*/, {
        message: "A senha deve conter pelo menos uma letra maiúscula",
      })
      .regex(/.*[a-z].*/, {
        message: "A senha deve conter pelo menos uma letra minúscula",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
