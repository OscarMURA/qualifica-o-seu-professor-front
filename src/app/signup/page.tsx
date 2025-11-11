"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/useAuth";
import { authService } from "@/lib/auth";
import type { RegisterData } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const _setAuth = useAuth((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    name: "",
    role: "student",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Calcular el progreso del formulario
  const progress = useMemo(() => {
    let completed = 0;
    const totalFields = 4; // name, email, password, confirmPassword

    if (formData.name.trim().length > 0) completed++;
    if (formData.email.trim().length > 0) completed++;
    if (formData.password.length >= 6) completed++;
    if (confirmPassword.length > 0 && confirmPassword === formData.password) completed++;

    return Math.round((completed / totalFields) * 100);
  }, [formData.name, formData.email, formData.password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar que las contraseñas coincidan
    if (formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar longitud mínima de contraseña
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
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
      <Card className="w-full max-w-md shadow-xl bg-white">
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
              {/* Barra de progreso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Progreso del registro</span>
                  <span className="text-slate-700 font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-slate-600 to-slate-700 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

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

              <Input
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
              />

              {/* Indicador visual de coincidencia de contraseñas */}
              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  {formData.password === confirmPassword ? (
                    <>
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600 font-medium">Las contraseñas coinciden</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-red-600 font-medium">Las contraseñas no coinciden</span>
                    </>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || progress < 100}
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

