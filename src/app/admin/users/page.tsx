"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "student" as "student" | "admin", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setError("Ingresa un ID o email para buscar");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (searchValue.includes("@")) {
        response = await api.get<User>(`/users/email/${searchValue}`);
      } else {
        response = await api.get<User>(`/users/${searchValue}`);
      }
      
      setSelectedUser(response.data);
      setEditForm({ 
        name: response.data.name, 
        email: response.data.email, 
        role: response.data.role,
        password: ""
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Usuario no encontrado");
      setSelectedUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      };

      if (editForm.password.trim()) {
        updateData.password = editForm.password;
      }

      await api.patch(`/users/${selectedUser.id}`, updateData);
      setSuccess("Usuario actualizado exitosamente");
      setEditForm({ ...editForm, password: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "No se pudo actualizar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (!confirm(`¿Estás seguro de eliminar al usuario ${selectedUser.name}?`)) return;

    setLoading(true);
    setError(null);

    try {
      await api.delete(`/users/${selectedUser.id}`);
      setSuccess("Usuario eliminado exitosamente");
      setSelectedUser(null);
      setSearchValue("");
    } catch (err: any) {
      setError(err.response?.data?.message || "No se pudo eliminar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
            <p className="text-slate-600 mt-1">Busca y administra usuarios del sistema</p>
          </div>
          <Button onClick={() => router.push("/admin")} variant="outline">
            Volver al Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buscar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="ID del usuario o email"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
            {success}
          </div>
        )}

        {selectedUser && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Usuario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">ID</label>
                  <p className="mt-1 text-xs text-slate-500 font-mono break-all bg-slate-50 p-2 rounded">
                    {selectedUser.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Fecha de Registro</label>
                  <p className="mt-1 text-slate-900">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Editar Usuario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Nombre"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  disabled={loading}
                />
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  disabled={loading}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as "student" | "admin" })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="student">Estudiante</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <Input
                  label="Nueva Contraseña (opcional)"
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Dejar vacío para no cambiar"
                  disabled={loading}
                />
                <div className="flex gap-3">
                  <Button onClick={handleUpdate} disabled={loading}>
                    {loading ? "Guardando..." : "Actualizar Usuario"}
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={loading}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Eliminar Usuario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
