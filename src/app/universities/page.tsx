"use client";

import Button from "@/components/ui/Button";
import {
  EmptyState,
  Pagination,
  SearchBar,
  UniversityCard,
} from "@/components/universities";
import { API_CONFIG } from "@/config/api";
import { University } from "@/types";
import { useEffect, useState } from "react";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter(
        (university) =>
          university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          university.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          university.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
    // Resetear a página 1 cuando se filtra
    setCurrentPage(1);
  }, [searchTerm, universities]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUniversities = filteredUniversities.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNIVERSITIES}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar las universidades");
      }

      const data = await response.json();
      setUniversities(data);
      setFilteredUniversities(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando universidades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUniversities} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Lista de Universidades
          </h1>
          <p className="text-slate-600 text-lg">
            Explora todas las universidades disponibles en nuestra plataforma
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultsCount={filteredUniversities.length}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        {/* Universities Grid */}
        {filteredUniversities.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUniversities.map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
