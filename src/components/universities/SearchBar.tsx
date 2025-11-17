interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
  currentPage: number;
  totalPages: number;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  resultsCount,
  currentPage,
  totalPages,
}: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 outline-none text-slate-700 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-slate-500">
          {resultsCount} universidad
          {resultsCount !== 1 ? "es" : ""} encontrada
          {resultsCount !== 1 ? "s" : ""}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-slate-500">
            Página {currentPage} de {totalPages}
          </p>
        )}
      </div>
    </div>
  );
}

