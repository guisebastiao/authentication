import type { DefaultResponse } from "@/types/api/default";
import axios from "axios";

export function handleApiError(error: unknown, defaultMessage?: string): never {
  if (axios.isAxiosError<DefaultResponse<null>>(error)) {
    const message = error.response?.data?.message || defaultMessage || "Erro ao processar requisição";
    throw new Error(message);
  }

  throw new Error(defaultMessage || "Erro inesperado na requisição");
}
