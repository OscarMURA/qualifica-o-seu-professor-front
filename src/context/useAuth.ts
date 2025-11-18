import type { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthContext {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

/**
 * Hook de autenticación para la plataforma Califica a tu Profesor
 * Maneja el estado de autenticación del usuario con persistencia en localStorage
 */
export const useAuth = create<AuthContext>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: "califica-auth-storage",
      onRehydrateStorage: () => (state) => {
        // After rehydration, update isAuthenticated based on token presence
        if (state?.token && state?.user) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);

