import { API_CONFIG } from "@/config/api";
import type { ApiError } from "@/types";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Solo redirigir si NO estamos en las páginas de autenticación
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath === "/login" || currentPath === "/signup";
        
        if (!isAuthPage) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

