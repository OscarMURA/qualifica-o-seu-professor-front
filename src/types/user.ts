export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user: User;
  emailVerified?: boolean;
  message?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}

