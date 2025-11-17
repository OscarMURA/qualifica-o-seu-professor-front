"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/useAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        {/* Contenido Izquierda */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 xl:p-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Califica a tu Profesor
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              {isAuthenticated
                ? `¡Bienvenido, ${user?.name}!`
                : "Bienvenido a la plataforma de evaluación de profesores"}
            </p>

            {!isAuthenticated && (
              <>
                <p className="text-base text-slate-500 mb-8">
                  Únete a nuestra comunidad y comparte tu experiencia con otros estudiantes. 
                  Ayuda a futuros alumnos a tomar mejores decisiones.
                </p>
                <div className="flex gap-4 flex-wrap">
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
              </>
            )}

            {isAuthenticated && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-blue-500">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800">Profesores</h3>
                      <p className="text-slate-600 text-sm">Explora y califica a tus profesores</p>
                    </div>
                    <Button onClick={() => router.push("/profesores")} size="sm">
                      Ver
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-indigo-500">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800">Universidades</h3>
                      <p className="text-slate-600 text-sm">Descubre universidades y sus profesores</p>
                    </div>
                    <Button onClick={() => router.push("/universities")} size="sm">
                      Ver
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-green-500">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800">Mis Evaluaciones</h3>
                      <p className="text-slate-600 text-sm">Revisa tus calificaciones anteriores</p>
                    </div>
                    <Button onClick={() => router.push("/mis-evaluaciones")} size="sm" variant="outline">
                      Ver
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Imagen Derecha */}
        <div className="relative hidden lg:block overflow-hidden">
          {/* Imagen con efecto Ken Burns (zoom suave) */}
          <div className="absolute inset-0 animate-ken-burns lg:rounded-l-[3rem] overflow-hidden">
            <Image
              src="/pexels-lilartsy-1236421.jpg"
              alt="Educación"
              fill
              className="object-cover object-center"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={95}
            />
          </div>
          
          {/* Overlay con gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 animate-pulse-slow lg:rounded-l-[3rem]"></div>
          
          {/* Elementos flotantes decorativos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none lg:rounded-l-[3rem]">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

