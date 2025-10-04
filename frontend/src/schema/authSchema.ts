import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty({ message: "Informe seu email" }).email({ message: "Informe um email válido" }).max(255, { message: "Seu email tem que ser menor que 255 caracteres" }),
  password: z.string().nonempty({ message: "Informe sua senha" }).min(6, { message: "Sua senha tem possuir mais de 6 caracteres" }).max(20, { message: "Sua senha tem possuir menos de 20 caracteres" }),
});

export const registerSchema = z
  .object({
    name: z.string().nonempty({ message: "Informe seu nome" }).max(255, { message: "Seu nome tem que ser menor que 255 caracteres" }),
    email: z.string().nonempty({ message: "Informe seu email" }).email({ message: "Informe um email válido" }).max(255, { message: "Seu email tem que ser menor que 255 caracteres" }),
    password: z.string().nonempty({ message: "Informe sua senha" }).min(6, { message: "Sua senha tem possuir mais de 6 caracteres" }).max(20, { message: "Sua senha tem possuir menos de 20 caracteres" }),
    confirmPassword: z.string().nonempty({ message: "Confirme sua senha" }).min(6, { message: "Sua senha tem possuir mais de 6 caracteres" }).max(20, { message: "Sua senha tem possuir menos de 20 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });
