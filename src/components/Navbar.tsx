"use client";

import { useAuth } from "@/context/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./ui/Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => navigateTo("/")}
              className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              Califica tu Profesor
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigateTo("/")}
                  className="text-slate-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => navigateTo("/profesores")}
                  className="text-slate-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profesores
                </button>
                <button
                  onClick={() => navigateTo("/universidades")}
                  className="text-slate-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Universidades
                </button>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 border-l border-slate-200 pl-4 ml-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {user?.role}
                    </span>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Salir
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo("/")}
                  className="text-slate-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Inicio
                </button>
                <Button
                  onClick={() => navigateTo("/login")}
                  variant="outline"
                  size="sm"
                >
                  Iniciar Sesión
                </Button>
                <Button onClick={() => navigateTo("/signup")} size="sm">
                  Registrarse
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-blue-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden border-t border-slate-200`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          {isAuthenticated ? (
            <>
              {/* User Info Mobile */}
              <div className="px-3 py-3 bg-slate-50 rounded-lg mb-2">
                <p className="text-sm font-medium text-slate-700">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 mb-2">{user?.email}</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => navigateTo("/")}
                className="text-slate-700 hover:text-blue-500 hover:bg-slate-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => navigateTo("/profesores")}
                className="text-slate-700 hover:text-blue-500 hover:bg-slate-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                Profesores
              </button>
              <button
                onClick={() => navigateTo("/universidades")}
                className="text-slate-700 hover:text-blue-500 hover:bg-slate-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                Universidades
              </button>
              <div className="pt-2 mt-2 border-t border-slate-200">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo("/")}
                className="text-slate-700 hover:text-blue-500 hover:bg-slate-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                Inicio
              </button>
              <div className="pt-2 space-y-2">
                <Button
                  onClick={() => navigateTo("/login")}
                  variant="outline"
                  className="w-full"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => navigateTo("/signup")}
                  className="w-full"
                >
                  Registrarse
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
