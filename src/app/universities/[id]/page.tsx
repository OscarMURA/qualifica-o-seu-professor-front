"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { universitiesService } from "@/lib/universities";
import type { University } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => String(params?.id ?? ""), [params]);

  const [loading, setLoading] = useState(true);
  const [university, setUniversity] = useState<University | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const u = await universitiesService.getById(id);
        setUniversity(u);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando universidad");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-slate-600">Cargando universidad...</div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No se pudo cargar</h2>
          <p className="text-slate-600 mb-4">{error ?? "Universidad no encontrada"}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const location = [university.city, university.country].filter(Boolean).join(", ");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {university.name}
            </h1>
            {location && (
              <p className="text-slate-700 mt-2">{location}</p>
            )}
          </div>
          <Button onClick={() => router.push(`/professors?university=${university.id}`)}>
            Ver listado de profesores
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Registrada el {new Date(university.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
