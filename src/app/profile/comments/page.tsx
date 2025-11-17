"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { getMyComments, updateComment, deleteComment } from "@/lib/comments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Comment } from "@/types/comment";

export default function MyCommentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ content: "", rating: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchComments();
  }, [isAuthenticated, router]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getMyComments();
      setComments(data);
    } catch (err) {
      setError("No se pudieron cargar los comentarios");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditForm({ content: comment.content, rating: comment.rating || 0 });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ content: "", rating: 0 });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateComment(id, {
        content: editForm.content,
        rating: editForm.rating || undefined,
      });
      setEditingId(null);
      fetchComments();
    } catch (err) {
      alert("No se pudo actualizar el comentario");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este comentario?")) return;

    try {
      await deleteComment(id);
      fetchComments();
    } catch (err) {
      alert("No se pudo eliminar el comentario");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Cargando comentarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mis Comentarios</h1>
            <p className="text-slate-600 mt-1">Gestiona todos tus comentarios</p>
          </div>
          <Button onClick={() => router.push("/profile")} variant="outline">
            Volver al Perfil
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {comments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-600 mb-4">No has realizado ningún comentario todavía</p>
              <Button onClick={() => router.push("/profesores")}>
                Explorar Profesores
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {comment.professor?.name || "Profesor"}
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        {comment.professor?.department || "Departamento no especificado"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {comment.rating && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
                          ⭐ {comment.rating}/5
                        </span>
                      )}
                      <span className="text-sm text-slate-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingId === comment.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-slate-700">Rating:</label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={editForm.rating}
                            onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
                            className="w-20"
                          />
                        </div>
                        <div className="flex gap-2 ml-auto">
                          <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                            Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-700 mb-4">{comment.content}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(comment)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
