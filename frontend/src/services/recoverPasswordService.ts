import type { CreateRecoverPasswordRequest, RecoverPasswordRequest } from "@/types/api/recoverPassword";
import type { DefaultResponse } from "@/types/api/default";
import { handleApiError } from "@/utils/handleApiError";
import { axios } from "@/api/axios";

const createRecoverPassword = async (data: CreateRecoverPasswordRequest): Promise<DefaultResponse<null>> => {
  try {
    const response = await axios.post("/recover-password", data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Erro ao realizar a criação de recuperação de senha");
  }
};

const recoverPassword = async ({ data, recoverToken }: { recoverToken: string; data: RecoverPasswordRequest }): Promise<DefaultResponse<null>> => {
  try {
    const response = await axios.put(`/recover-password/${recoverToken}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Erro ao realizar a recuperar a senha");
  }
};

export const recoverPasswordService = {
  createRecoverPassword,
  recoverPassword,
};
