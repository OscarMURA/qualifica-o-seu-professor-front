"use client";

import Button from "@/components/ui/Button";
import Pagination from "@/components/Pagination";
import ProfessorCard from "@/components/professors/ProfessorCard";
import { useAuth } from "@/context/useAuth";
import { professorsService } from "@/lib/professors";
import { universitiesService } from "@/lib/universities";
import type { Professor, University } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

export default function ProfessorsListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="text-slate-600">Cargando profesores...</div>
        </div>
      }
    >
      <ProfessorsListPageInner />
    </Suspense>
  );
}

function ProfessorsListPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [filtered, setFiltered] = useState<Professor[]>([]);

  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Inicializar filtro desde query param solo una vez
  useEffect(() => {
    if (initialized) return;
    const uniFromQuery = searchParams.get("university") || "";
    setUniversityFilter(uniFromQuery);
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, initialized]);

  // Sincronizar URL cuando cambia el filtro (luego de inicializar)
  useEffect(() => {
    if (!initialized) return;
    const newUrl = `/professors${universityFilter ? `?university=${universityFilter}` : ""}`;
    // replace para no llenar el historial
    router.replace(newUrl);
  }, [universityFilter, initialized, router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ps, us] = await Promise.all([
          professorsService.list(),
          universitiesService.list(),
        ]);
        setProfessors(ps);
        setUniversities(us);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let data = professors;
    const q = searchTerm.trim().toLowerCase();

    if (q) {
      data = data.filter((p) =>
        [p.name, p.department, p.university?.name]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }

    if (universityFilter) {
      data = data.filter(
        (p) => (p.university?.id || p.universityId) === universityFilter
      );
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [searchTerm, universityFilter, professors]);

  const totalPages = useMemo(
    () => Math.ceil(filtered.length / itemsPerPage) || 1,
    [filtered.length]
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-slate-600">Cargando profesores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => location.reload()} variant="outline">Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Lista de Profesores
            </h1>
            <p className="text-slate-600 text-lg">
              Explora todos los profesores disponibles en nuestra plataforma
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => router.push("/admin/professors/new")} size="lg" className="whitespace-nowrap">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Profesor
            </Button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex flex-1 items-center gap-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, depto o universidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-slate-700 placeholder-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Universidad:</label>
              <select
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-w-[220px]"
              >
                <option value="">Todas</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-slate-500">{filtered.length} profesor{filtered.length !== 1 ? "es" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
            {totalPages > 1 && (
              <p className="text-sm text-slate-500">Página {currentPage} de {totalPages}</p>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-600">No se encontraron profesores.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((p) => (
                <ProfessorCard key={p.id} professor={p} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
