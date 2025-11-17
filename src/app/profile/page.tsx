"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { getProfile } from "@/lib/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { ProfileData } from "@/types/profile";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfileData(data);
      } catch (err) {
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent>
            <div className="text-center py-6">
              <p className="text-red-600 mb-4">{error || "Error al cargar el perfil"}</p>
              <Button onClick={() => router.push("/")}>Volver al inicio</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user: profile, stats } = profileData;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-slate-600 mt-1">Información de tu cuenta y estadísticas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nombre</label>
                  <p className="mt-1 text-slate-900 text-lg">{profile.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-slate-900">{profile.email}</p>
                    {profile.isEmailVerified ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Verificado
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        No verificado
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Rol</label>
                  <div className="mt-1">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {profile.role === "admin" ? "Administrador" : "Estudiante"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Miembro desde</label>
                  <p className="mt-1 text-slate-900">{formatDate(profile.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-700">Total de Comentarios</div>
                  <div className="text-3xl font-bold text-blue-900 mt-1">
                    {stats.totalComments}
                  </div>
                </div>

                {stats.totalComments === 0 && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 text-center">
                      Aún no has realizado ningún comentario
                    </p>
                    <Button
                      onClick={() => router.push("/professors")}
                      size="sm"
                      className="w-full mt-3"
                    >
                      Explorar Profesores
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ID de Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 font-mono break-all bg-slate-50 p-2 rounded">
                  {profile.id}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
