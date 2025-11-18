"use client";

import { useRouter } from "next/navigation";
import type { Professor } from "@/types";

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

interface ProfessorCardProps {
  professor: Professor;
}

export default function ProfessorCard({ professor }: ProfessorCardProps) {
  const router = useRouter();
  const avg = professor.averageRating ?? 0;

  const go = () => router.push(`/professors/${professor.id}`);

  return (
    <div
      onClick={go}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group cursor-pointer"
    >
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-2">
          {professor.name}
        </h3>
        {professor.department && (
          <p className="text-sm text-slate-600 mb-2 line-clamp-1">{professor.department}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-slate-600 line-clamp-1">
            {professor.university?.name ?? "Universidad no asignada"}
          </div>
          <div className="flex items-center gap-2">
            <Stars value={avg} />
            <span className="text-xs text-slate-500">{avg.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

