import type { loginSchema, registerSchema } from "@/schema/authSchema";
import { z } from "zod";

export interface LoginResponse {
  name: string;
  email: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
}

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
