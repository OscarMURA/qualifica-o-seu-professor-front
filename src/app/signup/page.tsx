"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/auth";
import { useAuth } from "@/context/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { RegisterData } from "@/types";

export default function SignUpPage() {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    name: "",
    role: "student",
  });

  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await authService.register(formData);
      setSuccess(true);
      setRegisteredEmail(response.user.email);
    } catch (err) {
      const errorMessage = 
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
          : undefined;
      const message = Array.isArray(errorMessage) 
        ? errorMessage.join(", ") 
        : errorMessage;
      setError(message || "Error al registrar. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
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
      <Card className="w-full max-w-md shadow-xl bg-blue-100/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-slate-800">Crear Cuenta</CardTitle>
          <p className="text-center text-slate-600 mt-2">
            Únete a Califica a tu Profesor
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                <h3 className="font-semibold mb-2">Cuenta creada exitosamente</h3>
                <p className="text-sm mb-3">
                  Hemos enviado un enlace de verificación a <strong>{registeredEmail}</strong>
                </p>
                <p className="text-sm">
                  Por favor, revisa tu correo electrónico y haz clic en el enlace para verificar tu cuenta antes de iniciar sesión.
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full"
                  size="lg"
                >
                  Ir a Iniciar Sesión
                </Button>
                <div className="text-center text-sm text-slate-600">
                  ¿No recibiste el correo?{" "}
                  <button
                    onClick={async () => {
                      try {
                        await authService.resendVerification(registeredEmail);
                        alert("Correo de verificación reenviado. Por favor, revisa tu bandeja de entrada.");
                      } catch (err) {
                        alert("Error al reenviar el correo. Por favor, intenta más tarde.");
                      }
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline"
                  >
                    Reenviar correo
                  </button>
                </div>
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
                label="Nombre Completo"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
                disabled={isLoading}
              />

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
                minLength={6}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <div className="text-center text-sm text-slate-600">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

