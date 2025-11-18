"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { universitiesService, type CreateUniversityData, type UpdateUniversityData } from "@/lib/universities";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { University } from "@/types";

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
  });

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
        loadData();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, authChecked, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await universitiesService.list();
      setUniversities(data);
    } catch (error) {
      console.error("Error loading universities:", error);
      setError("Error al cargar universidades");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (uni.country || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (uni.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    setFormData({
      name: university.name,
      country: university.country || "",
      city: university.city || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedUniversity(null);
    setIsEditing(false);
    setFormData({ name: "", country: "", city: "" });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniversity) return;

    try {
      const updateData: UpdateUniversityData = {};
      if (formData.name !== selectedUniversity.name) updateData.name = formData.name;
      if (formData.country !== selectedUniversity.country)
        updateData.country = formData.country;
      if (formData.city !== selectedUniversity.city)
        updateData.city = formData.city;

      const updated = await universitiesService.update(selectedUniversity.id, updateData);

      setUniversities((prev) =>
        prev.map((uni) => (uni.id === selectedUniversity.id ? updated : uni))
      );

      setSuccess("Universidad actualizada exitosamente");
      setTimeout(() => setSuccess(null), 3000);

      setSelectedUniversity(null);
      setIsEditing(false);
      setFormData({ name: "", country: "", city: "" });
    } catch (error: any) {
      console.error("Error updating university:", error);
      setError(error.response?.data?.message || "Error al actualizar la universidad");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta universidad? Todos sus profesores y comentarios relacionados también serán eliminados. Esta acción no se puede deshacer."))
      return;

    try {
      await universitiesService.remove(id);
      setUniversities((prev) => prev.filter((uni) => uni.id !== id));
      if (selectedUniversity?.id === id) {
        handleCancelEdit();
      }
      setSuccess("Universidad eliminada exitosamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error deleting university:", error);
      setError(error.response?.data?.message || "Error al eliminar la universidad");
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
            Gestionar Universidades
          </h1>
          <Button onClick={() => router.push("/admin/universities/new")}>
            Crear Universidad
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
            placeholder="Buscar por ID, nombre o ubicación..."
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
                Lista de Universidades ({filteredUniversities.length})
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredUniversities.map((university) => (
                  <Card
                    key={university.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedUniversity?.id === university.id
                        ? "ring-2 ring-blue-500 dark:ring-blue-400"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleEdit(university)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {university.name}
                        </h3>
                        {(university.city || university.country) && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📍 {[university.city, university.country].filter(Boolean).join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          ID: {university.id}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDelete(university.id);
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
              {isEditing && selectedUniversity ? (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Editar Universidad
                  </h2>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ID
                      </label>
                      <Input type="text" value={selectedUniversity.id} disabled />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ciudad
                      </label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        País
                      </label>
                      <Input
                        type="text"
                        value={formData.country}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
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
                  <p>Selecciona una universidad para editar</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
