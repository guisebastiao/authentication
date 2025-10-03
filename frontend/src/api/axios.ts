import type { DefaultResponse } from "@/types/api/default";
import axiosInstance from "axios";
import Cookies from "js-cookie";

const axios = axiosInstance.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosRefresh = axiosInstance.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(async (config) => {
  const accessTokenDuration = Cookies.get("access_token_expires");
  const refreshTokenDuration = Cookies.get("refresh_token_expires");
  const isAuthenticated = Cookies.get("is_authenticated");

  if (!accessTokenDuration || !refreshTokenDuration) return config;

  const now = new Date();
  const expiresToken = new Date(accessTokenDuration);
  const expiresRefresh = new Date(refreshTokenDuration);

  if (expiresRefresh <= now) {
    window.dispatchEvent(new CustomEvent("logout"));
    return config;
  }

  if (expiresToken <= now && isAuthenticated === "true") {
    try {
      const { status } = await axiosRefresh.post<DefaultResponse<null>>("/auth/refresh");

      if (status !== 200) {
        window.dispatchEvent(new CustomEvent("logout"));
      }
    } catch (error) {
      window.dispatchEvent(new CustomEvent("logout"));
      return Promise.reject(error);
    }
  }

  return config;
});

axios.interceptors.response.use(
  async (response) => response,
  (error) => {
    const isAuthenticated = Cookies.get("is_authenticated");

    if (!isAuthenticated) {
      return Promise.resolve();
    }

    if (isAuthenticated === "false") {
      window.dispatchEvent(new CustomEvent("logout"));
    }

    return Promise.reject(error);
  }
);

export { axios };
