"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import UniversityForm from "@/components/universities/UniversityForm";
import type { University } from "@/types";

export default function EditUniversityPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const universityId = params.id as string;

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Verificar que sea admin
    if (user?.role !== "admin") {
      router.push("/universities");
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleSuccess = (university: University) => {
    // Redirigir a la lista de universidades después de editar
    router.push("/universities");
  };

  const handleCancel = () => {
    router.push("/universities");
  };

  // Mostrar loading mientras verifica autenticación
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <UniversityForm
            mode="edit"
            universityId={universityId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

