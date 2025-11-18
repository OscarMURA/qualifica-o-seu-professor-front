"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Obtener el token de la URL usando window.location
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado en la URL.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verificado exitosamente.");
      } catch (err) {
        setStatus("error");
        const errorMessage = 
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined;
        setMessage(errorMessage || "Error al verificar el email. El enlace puede haber expirado o ya fue usado.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-xl bg-blue-100/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-slate-800">
            Verificación de Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600">Verificando tu email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                <h3 className="font-semibold mb-2">Email verificado exitosamente</h3>
                <p className="text-sm">{message}</p>
              </div>
              <Button
                onClick={() => router.push("/login")}
                className="w-full"
                size="lg"
              >
                Ir a Iniciar Sesión
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                <h3 className="font-semibold mb-2">Error en la verificación</h3>
                <p className="text-sm">{message}</p>
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
                  ¿Necesitas un nuevo enlace?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium underline-offset-2 hover:underline"
                  >
                    Solicita uno nuevo
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
