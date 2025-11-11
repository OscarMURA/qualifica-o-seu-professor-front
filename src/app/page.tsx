"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 md:p-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Califica a tu Profesor
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            {isAuthenticated
              ? `¡Bienvenido, ${user?.name}!`
              : "Bienvenido a la plataforma de evaluación de profesores"}
          </p>

          {!isAuthenticated && (
            <div className="flex gap-4 justify-center flex-wrap">
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

          {isAuthenticated && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                <div className="text-blue-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Profesores</h3>
                <p className="text-slate-600 text-sm mb-4">Explora y califica a tus profesores</p>
                <Button onClick={() => router.push("/profesores")} className="w-full" size="sm">
                  Ver Profesores
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                <div className="text-indigo-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Universidades</h3>
                <p className="text-slate-600 text-sm mb-4">Descubre universidades y sus profesores</p>
                <Button onClick={() => router.push("/universidades")} className="w-full" size="sm">
                  Ver Universidades
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                <div className="text-green-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Mis Evaluaciones</h3>
                <p className="text-slate-600 text-sm mb-4">Revisa tus calificaciones anteriores</p>
                <Button onClick={() => router.push("/mis-evaluaciones")} className="w-full" size="sm" variant="outline">
                  Ver Evaluaciones
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

