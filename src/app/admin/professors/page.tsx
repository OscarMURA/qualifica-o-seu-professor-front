"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { professorsService, type UpdateProfessorData } from "@/lib/professors";
import { universitiesService } from "@/lib/universities";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { Professor, University } from "@/types";
import { useAuth } from "@/context/useAuth";

export default function AdminProfessorsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    university: "",
  });

  useEffect(() => {
    // Esperar un momento para que Zustand rehidrate el estado
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
        loadData();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, authChecked, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profData, uniData] = await Promise.all([
        professorsService.list(),
        universitiesService.list(),
      ]);
      setProfessors(profData);
      setUniversities(uniData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredProfessors = professors.filter(
    (prof) =>
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prof.department || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (professor: Professor) => {
    setSelectedProfessor(professor);
    setFormData({
      name: professor.name,
      department: professor.department || "",
      university: professor.university?.id || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedProfessor(null);
    setIsEditing(false);
    setFormData({ name: "", department: "", university: "" });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessor) return;

    try {
      const updateData: UpdateProfessorData = {};
      if (formData.name !== selectedProfessor.name) updateData.name = formData.name;
      if (formData.department !== selectedProfessor.department)
        updateData.department = formData.department;
      if (formData.university !== selectedProfessor.university?.id)
        updateData.university = formData.university;

      const updated = await professorsService.update(selectedProfessor.id, updateData);

      setProfessors((prev) =>
        prev.map((prof) => (prof.id === selectedProfessor.id ? updated : prof))
      );

      setSuccess("Profesor actualizado exitosamente");
      setTimeout(() => setSuccess(null), 3000);
      
      setSelectedProfessor(null);
      setIsEditing(false);
      setFormData({ name: "", department: "", university: "" });
    } catch (error: any) {
      console.error("Error updating professor:", error);
      setError(error.response?.data?.message || "Error al actualizar el profesor");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este profesor? Todos sus comentarios también serán eliminados. Esta acción no se puede deshacer."))
      return;

    try {
      await professorsService.remove(id);
      setProfessors((prev) => prev.filter((prof) => prof.id !== id));
      if (selectedProfessor?.id === id) {
        handleCancelEdit();
      }
      setSuccess("Profesor eliminado exitosamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error deleting professor:", error);
      setError(error.response?.data?.message || "Error al eliminar el profesor");
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
              Gestionar Profesores
            </h1>
            <Button onClick={() => router.push("/admin/professors/new")}>
              Crear Profesor
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
              placeholder="Buscar por ID, nombre o departamento..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Lista de Profesores ({filteredProfessors.length})
                </h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredProfessors.map((professor) => (
                    <Card
                      key={professor.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedProfessor?.id === professor.id
                          ? "ring-2 ring-blue-500 dark:ring-blue-400"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleEdit(professor)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {professor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {professor.department}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {professor.university?.name || "Sin universidad"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                            ID: {professor.id}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDelete(professor.id);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                {isEditing && selectedProfessor ? (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Editar Profesor
                    </h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ID
                        </label>
                        <Input type="text" value={selectedProfessor.id} disabled />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre *
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Departamento *
                        </label>
                        <Input
                          type="text"
                          value={formData.department}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, department: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Universidad *
                        </label>
                        <select
                          value={formData.university}
                          onChange={(e) =>
                            setFormData({ ...formData, university: e.target.value })
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="">Seleccionar universidad</option>
                          {universities.map((uni) => (
                            <option key={uni.id} value={uni.id}>
                              {uni.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                          Guardar Cambios
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleCancelEdit}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </Card>
                ) : (
                  <Card className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <p>Selecciona un profesor para editar</p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
