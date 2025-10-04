import type { createRecoverPasswordSchema, recoverPasswordSchema } from "@/schema/recoverPasswordSchema";
import { z } from "zod";

export type CreateRecoverPasswordRequest = z.infer<typeof createRecoverPasswordSchema>;
export type RecoverPasswordRequest = z.infer<typeof recoverPasswordSchema>;
