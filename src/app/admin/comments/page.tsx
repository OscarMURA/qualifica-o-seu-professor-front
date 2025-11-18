"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import type { Comment } from "@/types/comment";

interface CommentWithDetails extends Comment {
  professor?: {
    id: string;
    name: string;
    department: string;
  };
  student?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminCommentsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComment, setSelectedComment] = useState<CommentWithDetails | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      if (user?.role !== "admin") {
        router.push("/");
        return;
      }
      if (!authChecked) {
        setAuthChecked(true);
        loadComments();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, authChecked, router]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: CommentWithDetails[] } | CommentWithDetails[]>("/comments");
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setComments(data || []);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = comments.filter(
    (comment) =>
      comment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.professor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.student?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este comentario?")) return;

    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      if (selectedComment?.id === id) {
        setSelectedComment(null);
      }
      setSuccess("Comentario eliminado exitosamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      setError(error.response?.data?.message || "Error al eliminar el comentario");
      setTimeout(() => setError(null), 5000);
    }
  };

  if (!authChecked || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestionar Comentarios
          </h1>
          <Button variant="secondary" onClick={() => router.push("/admin")}>
            Volver al Dashboard
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
          </div>
        )}

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Buscar por ID, contenido, profesor o estudiante..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Lista de Comentarios ({filteredComments.length})
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredComments.map((comment) => (
                  <Card
                    key={comment.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedComment?.id === comment.id
                        ? "ring-2 ring-blue-500 dark:ring-blue-400"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedComment(comment)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500">
                            {"★".repeat(comment.rating || 0)}
                            {"☆".repeat(5 - (comment.rating || 0))}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white line-clamp-2 mb-2">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Profesor: {comment.professor?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Estudiante: {comment.student?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDelete(comment.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              {selectedComment ? (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Detalles del Comentario
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ID
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white break-all">
                        {selectedComment.id}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Calificación
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 text-xl">
                          {"★".repeat(selectedComment.rating || 0)}
                          {"☆".repeat(5 - (selectedComment.rating || 0))}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({selectedComment.rating}/5)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Comentario
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                        {selectedComment.content}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Profesor
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedComment.professor?.name || "N/A"}
                      </p>
                      {selectedComment.professor?.department && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {selectedComment.professor.department}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estudiante
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedComment.student?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {selectedComment.student?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fechas
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Creado: {new Date(selectedComment.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Actualizado: {new Date(selectedComment.updatedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(selectedComment.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        Eliminar Comentario
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <p>Selecciona un comentario para ver los detalles</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
