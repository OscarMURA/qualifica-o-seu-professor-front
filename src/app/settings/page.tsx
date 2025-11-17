"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState({ profile: false, password: false, delete: false });
  const [errors, setErrors] = useState({ profile: "", password: "", delete: "" });
  const [success, setSuccess] = useState({ profile: "", password: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    setErrors({ ...errors, profile: "" });
    setSuccess({ ...success, profile: "" });

    try {
      const emailChanged = profileForm.email !== user.email;
      
      const response = await api.patch(`/users/${user.id}`, {
        name: profileForm.name,
        email: profileForm.email,
      });
      
      updateUser(response.data);
      
      if (emailChanged) {
        setSuccess({ 
          ...success, 
          profile: "Perfil actualizado. Se ha enviado un correo de verificación a tu nuevo email. Por favor verifica tu correo." 
        });
      } else {
        setSuccess({ ...success, profile: "Perfil actualizado exitosamente" });
      }
    } catch (err: any) {
      setErrors({ ...errors, profile: err.response?.data?.message || "Error al actualizar el perfil" });
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, password: true });
    setErrors({ ...errors, password: "" });
    setSuccess({ ...success, password: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ ...errors, password: "Las contraseñas no coinciden" });
      setLoading({ ...loading, password: false });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrors({ ...errors, password: "La contraseña debe tener al menos 6 caracteres" });
      setLoading({ ...loading, password: false });
      return;
    }

    try {
      await api.patch(`/users/${user.id}`, {
        password: passwordForm.newPassword,
      });
      setSuccess({ ...success, password: "Contraseña actualizada exitosamente" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrors({ ...errors, password: err.response?.data?.message || "Error al cambiar la contraseña" });
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "ELIMINAR") {
      setErrors({ ...errors, delete: "Debes escribir 'ELIMINAR' para confirmar" });
      return;
    }

    if (!confirm("¿Estás completamente seguro? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading({ ...loading, delete: true });
    setErrors({ ...errors, delete: "" });

    try {
      await api.delete(`/users/${user.id}`);
      logout();
      router.push("/");
    } catch (err: any) {
      setErrors({ ...errors, delete: err.response?.data?.message || "Error al eliminar la cuenta" });
    } finally {
      setLoading({ ...loading, delete: false });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
            <p className="text-slate-600 mt-1">Gestiona tu cuenta y preferencias</p>
          </div>
          <Button onClick={() => router.push("/profile")} variant="outline">
            Volver al Perfil
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {success.profile && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {success.profile}
                  </div>
                )}
                {errors.profile && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errors.profile}
                  </div>
                )}
                <Input
                  label="Nombre"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  disabled={loading.profile}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  disabled={loading.profile}
                />
                <Button type="submit" disabled={loading.profile}>
                  {loading.profile ? "Guardando..." : "Actualizar Perfil"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {success.password && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {success.password}
                  </div>
                )}
                {errors.password && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errors.password}
                  </div>
                )}
                <Input
                  label="Nueva Contraseña"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  disabled={loading.password}
                  placeholder="Mínimo 6 caracteres"
                />
                <Input
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  disabled={loading.password}
                />
                <Button type="submit" disabled={loading.password}>
                  {loading.password ? "Guardando..." : "Cambiar Contraseña"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Una vez eliminada tu cuenta, no hay vuelta atrás. Por favor, está seguro.
              </p>
              {errors.delete && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errors.delete}
                </div>
              )}
              <Input
                label="Escribe 'ELIMINAR' para confirmar"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="ELIMINAR"
                disabled={loading.delete}
              />
              <Button
                type="button"
                onClick={handleDeleteAccount}
                disabled={loading.delete || deleteConfirmation !== "ELIMINAR"}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading.delete ? "Eliminando..." : "Eliminar Cuenta Permanentemente"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
