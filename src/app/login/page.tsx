"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/useAuth";
import { authService } from "@/lib/auth";
import type { LoginCredentials } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailNotVerified(false);

    try {
      const response = await authService.login(formData);
      
      // DEBUG: Log para ver qué está devolviendo el backend
      console.log("Login response:", response);
      
      // IMPORTANTE: Si emailVerified es false o undefined, NO permitir login
      if (response.emailVerified === false || response.emailVerified === undefined) {
        setEmailNotVerified(true);
        setUnverifiedEmail(formData.email);
        setIsLoading(false);
        return;
      }

      // Verificar que tenga token ANTES de hacer login
      const token = response.token || response.accessToken;
      
      // Si NO hay token, NO hacer login (aunque emailVerified sea true)
      if (!token) {
        setError("No se pudo obtener el token de acceso. Tu email debe estar verificado para iniciar sesión.");
        setEmailNotVerified(true);
        setUnverifiedEmail(formData.email);
        setIsLoading(false);
        return;
      }

      // SOLO hacer login si está verificado (true) Y tiene token
      if (response.emailVerified === true && token) {
        setAuth(response.user, token);
        router.push("/");
      } else {
        // Fallback: Si llegamos aquí, algo está mal
        setError("Debes verificar tu email antes de iniciar sesión.");
        setEmailNotVerified(true);
        setUnverifiedEmail(formData.email);
        setIsLoading(false);
      }
    } catch (err) {
      const errorMessage = 
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
          : undefined;
      const message = Array.isArray(errorMessage) 
        ? errorMessage.join(", ") 
        : errorMessage;
      setError(message || "Credenciales inválidas. Por favor, intenta de nuevo.");
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await authService.resendVerification(unverifiedEmail);
      alert("Correo de verificación reenviado. Por favor, revisa tu bandeja de entrada.");
    } catch (err) {
      alert("Error al reenviar el correo. Por favor, intenta más tarde.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-slate-800">Iniciar Sesión</CardTitle>
          <p className="text-center text-slate-600 mt-2">
            Entra a tu cuenta
          </p>
        </CardHeader>
        <CardContent>
          {emailNotVerified ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
                <h3 className="font-semibold mb-2">Email no verificado</h3>
                <p className="text-sm mb-3">
                  Tu cuenta con el email <strong>{unverifiedEmail}</strong> aún no ha sido verificada.
                </p>
                <p className="text-sm">
                  Hemos enviado un nuevo enlace de verificación a tu correo. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleResendVerification}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  Reenviar correo de verificación
                </Button>
                <Button
                  onClick={() => {
                    setEmailNotVerified(false);
                    setFormData({ email: unverifiedEmail, password: "" });
                  }}
                  className="w-full"
                  size="lg"
                  variant="ghost"
                >
                  Volver a intentar
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />

              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center text-sm text-slate-600">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

