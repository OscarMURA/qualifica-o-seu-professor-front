import { api } from "./api";
import { API_CONFIG } from "@/config/api";
import type { LoginCredentials, RegisterData, AuthResponse } from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  async getProfile(): Promise<AuthResponse["user"]> {
    const response = await api.get<AuthResponse["user"]>(
      API_CONFIG.ENDPOINTS.AUTH.ME
    );
    return response.data;
  },
};

