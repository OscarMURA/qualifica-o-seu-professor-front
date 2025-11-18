"use client";

import { University } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const getLocation = (): string => {
    const parts = [] as string[];
    if (university.city) parts.push(university.city);
    if (university.country) parts.push(university.country);
    return parts.length > 0 ? parts.join(", ") : "Ubicación no especificada";
  };

  const handleEdit = () => {
    router.push(`/universities/${university.id}/edit`);
  };

  const goToDetails = () => {
    router.push(`/universities/${university.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group">
      <div className="p-6">
        {/* University Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        {/* University Name */}
        <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2 min-h-[3.5rem]">
          {university.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-slate-600 mb-4">
          <svg
            className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm">{getLocation()}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4"></div>

        {/* Footer Info */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Registrada el{" "}
            {new Date(university.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToDetails}
              className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50 text-sm font-medium"
              title="Ver detalles"
            >
              Ver detalles
            </button>
            {isAdmin && (
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50"
                title="Editar universidad"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
