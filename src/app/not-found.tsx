"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Imagen 404 */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/image.png"
            alt="404 Not Found"
            width={600}
            height={400}
            className="w-full max-w-md h-auto"
            priority
          />
        </div>

        {/* Mensaje */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Página no encontrada
          </h1>
          <p className="text-base text-slate-500">
            Puede que hayas escrito mal la URL o que la página haya sido eliminada.
          </p>
        </div>

        {/* Botón para volver */}
        <div className="flex justify-center">
          <Link href="/">
            <Button size="lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

