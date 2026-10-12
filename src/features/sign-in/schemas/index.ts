import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Email inválido").min(1, { message: "Informe o email" }),
  password: z
    .string()
    .min(1, { message: "Informe a senha" })
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
});
