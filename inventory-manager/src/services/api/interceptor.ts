import api from "./client";
import { logout } from "../../utils/logout";

export function setupInterceptors() {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        !error.config?.url?.includes("/api/Auth/login")
      ) {
        logout();
      }

      return Promise.reject(error);
    },
  );
}
