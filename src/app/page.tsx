"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import Button from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Califica a tu Profesor
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            {isAuthenticated
              ? `Bienvenido, ${user?.name}!`
              : "Bienvenida a la plataforma de evaluación de profesores"}
          </p>

          {isAuthenticated ? (
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div className="text-sm text-slate-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                Conectado como: <span className="font-semibold">{user?.email}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {user?.role}
                </span>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/signup")} size="lg">
                Comenzar
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                size="lg"
              >
                Iniciar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
