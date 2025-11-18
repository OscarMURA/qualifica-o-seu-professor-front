"use client";

import Button from "@/components/ui/Button";
import ProfessorForm from "@/components/professors/ProfessorForm";
import { useAuth } from "@/context/useAuth";
import { professorsService } from "@/lib/professors";
import type { Professor } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function EditProfessorPage() {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => String(params?.id ?? ""), [params]);

  const { isAuthenticated, user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "admin") {
      router.push("/professors");
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleSuccess = (prof: Professor) => {
    router.push(`/professors/${prof.id}`);
  };

  const handleCancel = () => {
    router.push(`/professors/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm("¿Seguro que deseas eliminar este profesor? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    try {
      setDeleting(true);
      await professorsService.remove(id);
      router.push("/professors");
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo eliminar el profesor");
    } finally {
      setDeleting(false);
    }
  };

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
          <div className="w-full max-w-2xl">
            <div className="flex justify-end mb-4">
              <Button onClick={handleDelete} variant="outline" disabled={deleting}>
                {deleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
            <ProfessorForm mode="edit" professorId={id} onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </div>
      </div>
    </div>
  );
}

