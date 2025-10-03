import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/api/auth";
import type { DefaultResponse } from "@/types/api/default";
import { handleApiError } from "@/utils/handleApiError";
import { axios } from "@/api/axios";

const login = async (data: LoginRequest): Promise<DefaultResponse<LoginResponse>> => {
  try {
    const response = await axios.post("/auth/login", data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Erro ao realizar login");
  }
};

const register = async (data: RegisterRequest): Promise<DefaultResponse<RegisterResponse>> => {
  try {
    const response = await axios.post("/auth/register", data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Erro ao realizar registro");
  }
};

const logout = async (): Promise<DefaultResponse<null>> => {
  try {
    const response = await axios.post("/auth/logout");
    return response.data;
  } catch (error) {
    handleApiError(error, "Erro ao realizar o logout");
  }
};

export const authService = {
  login,
  register,
  logout,
};
