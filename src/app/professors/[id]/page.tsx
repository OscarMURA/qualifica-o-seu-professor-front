"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/context/useAuth";
import { professorsService } from "@/lib/professors";
import type { CommentItem, Professor } from "@/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

function Stars({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < filled ? "text-yellow-400" : "text-slate-300"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProfessorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const id = useMemo(() => String((params as any)?.id ?? ""), [params]);

  const [loading, setLoading] = useState(true);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [p, c] = await Promise.all([
          professorsService.getById(id),
          professorsService.getComments(id),
        ]);
        setProfessor(p);
        setComments(c);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const avg =
    professor?.averageRating ??
    (comments.length
      ? comments.reduce((acc, it) => acc + (it.rating ?? 0), 0) / comments.length
      : 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !professor) return;
    try {
      setSubmitting(true);
      const created = await professorsService.addComment({
        professorId: professor.id,
        rating,
        content,
      });
      setComments((prev) => [created, ...prev]);
      setContent("");
      setRating(5);
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo enviar el comentario");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-slate-600">Cargando profesor...</div>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No se pudo cargar</h2>
          <p className="text-slate-600 mb-4">{error ?? "Profesor no encontrado"}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const university = professor.university;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {professor.name}
            </h1>
            {isAdmin && (
              <Link href={`/admin/professors/${professor.id}/edit`} className="self-start">
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </Link>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-700">
            {professor.department && (
              <span className="inline-flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {professor.department}
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-sm">
              <Stars value={avg || 0} />
              <span className="text-slate-600">{(avg || 0).toFixed(1)} / 5</span>
            </span>
          </div>
        </div>

        {/* Universidad */}
        {(university || professor.universityId) && (
          <Card>
            <CardHeader>
              <CardTitle>Universidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-slate-800 font-medium">
                    {university?.name || "Ver universidad"}
                  </div>
                  {university && (
                    <div className="text-slate-600 text-sm">
                      {[university.city, university.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
                <Link
                  href={`/universities/${university?.id || professor.universityId}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver universidad
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bio */}
        {professor.bio && (
          <Card>
            <CardHeader>
              <CardTitle>Acerca del profesor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {professor.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comments and form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comentarios</CardTitle>
              </CardHeader>
              <CardContent>
                {comments.length === 0 ? (
                  <div className="text-slate-600">Aún no hay comentarios.</div>
                ) : (
                  <ul className="space-y-4">
                    {comments.map((c) => (
                      <li
                        key={c.id}
                        className="border border-slate-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-slate-600">
                            {c.author?.name ?? "Anónimo"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Stars value={c.rating} />
                            <span className="text-xs text-slate-500">
                              {new Date(c.createdAt).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line">{c.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Dejar un comentario</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Calificación
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => {
                            const value = index + 1;
                            const active = value <= rating;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className="p-0.5"
                                aria-label={`Calificar con ${value} estrella${value > 1 ? "s" : ""}`}
                              >
                                <svg
                                  className={`w-6 h-6 transition-colors ${
                                    active ? "text-yellow-400" : "text-slate-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            );
                          })}
                        </div>
                        <span className="w-8 text-center text-slate-700 font-medium">
                          {rating}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Comentario
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe tu opinión..."
                        className="w-full h-28 resize-vertical rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={submitting || content.trim() === ""}>
                      {submitting ? "Enviando..." : "Publicar comentario"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>¿Quieres comentar?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    Inicia sesión para dejar tu calificación y comentario.
                  </p>
                  <Link href="/login">
                    <Button>Iniciar sesión</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

