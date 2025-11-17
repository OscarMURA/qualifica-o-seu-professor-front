"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { universitiesService } from "@/lib/universities";
import { professorsService } from "@/lib/professors";
import type { University, Professor } from "@/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function Stars({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < filled ? "text-yellow-400" : "text-slate-300"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => String(params?.id ?? ""), [params]);

  const [loading, setLoading] = useState(true);
  const [university, setUniversity] = useState<University | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [u, ps] = await Promise.all([
          universitiesService.getById(id),
          professorsService.list(),
        ]);
        setUniversity(u);
        const filtered = ps.filter(
          (p) => (p.university?.id || p.universityId) === id
        );
        setProfessors(filtered);
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
  const professorsCount = professors.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Header */}
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

        {/* Detalles organizados */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Universidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase text-slate-500">ID</div>
                <div className="text-slate-800 break-all">{university.id}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Nombre</div>
                <div className="text-slate-800">{university.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">País</div>
                <div className="text-slate-800">{university.country || "No especificado"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Ciudad</div>
                <div className="text-slate-800">{university.city || "No especificado"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Profesores</div>
                <div className="text-slate-800">{professorsCount}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Creada</div>
                <div className="text-slate-800">
                  {new Date(university.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Actualizada</div>
                <div className="text-slate-800">
                  {new Date(university.updatedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profesores (resumen) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profesores</CardTitle>
              <Link href={`/professors?university=${university.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {professors.length === 0 ? (
              <div className="text-slate-600">Esta universidad no tiene profesores registrados aún.</div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {professors.slice(0, 5).map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <Link href={`/professors/${p.id}`} className="text-slate-800 font-medium hover:text-blue-700">
                        {p.name}
                      </Link>
                      <div className="text-sm text-slate-600">
                        {p.department || "Departamento no especificado"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars value={p.averageRating ?? 0} />
                      <span className="text-xs text-slate-500">{(p.averageRating ?? 0).toFixed(1)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
