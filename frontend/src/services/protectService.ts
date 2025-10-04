import type { DefaultResponse } from "@/types/api/default";
import { handleApiError } from "@/utils/handleApiError";
import { axios } from "@/api/axios";

const protectRoute = async (): Promise<DefaultResponse<string>> => {
  try {
    const response = await axios.get("/protect");
    return response.data;
  } catch (error) {
    handleApiError(error, "Erro ao buscar a rota protegida");
  }
};

export const protectService = {
  protectRoute,
};
