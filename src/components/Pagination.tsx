import Button from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* Botón Anterior */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="disabled:opacity-50 disabled:cursor-not-allowed gap-1"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Anterior
      </Button>

      {/* Números de página */}
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Mostrar solo algunas páginas para evitar overflow
          const showPage =
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1);

          const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
          const showEllipsisAfter =
            page === currentPage + 2 && currentPage < totalPages - 2;

          if (showEllipsisBefore || showEllipsisAfter) {
            return (
              <span key={page} className="px-3 py-2 text-slate-400">
                ...
              </span>
            );
          }

          if (!showPage) return null;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Botón Siguiente */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="disabled:opacity-50 disabled:cursor-not-allowed gap-1"
      >
        Siguiente
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>
    </div>
  );
}

