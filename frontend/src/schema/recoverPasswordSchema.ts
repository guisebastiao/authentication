import { z } from "zod";

export const createRecoverPasswordSchema = z.object({
  email: z.string().nonempty({ message: "Informe seu email" }).email({ message: "Informe um email válido" }).max(255, { message: "Seu email tem que ser menor que 255 caracteres" }),
});

export const recoverPasswordSchema = z
  .object({
    newPassword: z.string().nonempty({ message: "Informe sua senha" }).min(6, { message: "Sua senha tem possuir mais de 6 caracteres" }).max(20, { message: "Sua senha tem possuir menos de 20 caracteres" }),
    confirmPassword: z.string().nonempty({ message: "Confirme sua senha" }).min(6, { message: "Sua senha tem possuir mais de 6 caracteres" }).max(20, { message: "Sua senha tem possuir menos de 20 caracteres" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });
