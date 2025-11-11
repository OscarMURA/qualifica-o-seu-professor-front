import { api } from "./api";
import { API_CONFIG } from "@/config/api";
import type { LoginCredentials, RegisterData, AuthResponse, RegisterResponse, VerifyEmailResponse } from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
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

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const response = await api.get<VerifyEmailResponse>(
      `${API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`
    );
    return response.data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      API_CONFIG.ENDPOINTS.AUTH.RESEND_VERIFICATION,
      { email }
    );
    return response.data;
  },
};

