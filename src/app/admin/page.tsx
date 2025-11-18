"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { getAdminStats } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { AdminStats } from "@/types/admin";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/");
      return;
    }

    fetchStats();
  }, [isAuthenticated, user, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent>
            <div className="text-center py-6">
              <p className="text-red-600 mb-4">{error || "Error al cargar el dashboard"}</p>
              <Button onClick={() => router.push("/")}>Volver al inicio</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickActions = [
    { label: "Gestionar Usuarios", path: "/admin/users" },
    { label: "Gestionar Profesores", path: "/admin/professors" },
    { label: "Gestionar Universidades", path: "/admin/universities" },
    { label: "Gestionar Comentarios", path: "/admin/comments" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard Administrativo</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Panel de control y estadísticas generales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Profesores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalProfessors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Universidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalUniversities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Comentarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalComments}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.path}
                  onClick={() => router.push(action.path)}
                  variant="outline"
                  className="h-20 text-sm font-medium"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
