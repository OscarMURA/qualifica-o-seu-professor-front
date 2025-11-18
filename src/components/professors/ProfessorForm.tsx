"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { professorsService, type CreateProfessorData, type UpdateProfessorData } from "@/lib/professors";
import { universitiesService } from "@/lib/universities";
import type { Professor, University } from "@/types";
import { useEffect, useState } from "react";

interface ProfessorFormProps {
  mode: "create" | "edit";
  professorId?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  submittingLabel?: string;
  onSuccess?: (professor: Professor) => void;
  onCancel?: () => void;
}

export default function ProfessorForm({
  mode,
  professorId,
  title,
  description,
  submitLabel,
  submittingLabel,
  onSuccess,
  onCancel,
}: ProfessorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    universityId: "",
  });
  const [initialData, setInitialData] = useState({
    name: "",
    department: "",
    universityId: "",
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Defaults
  const defaultTitle = mode === "create" ? "Crear Nuevo Profesor" : "Editar Profesor";
  const defaultDescription =
    mode === "create"
      ? "Completa el formulario para agregar un nuevo profesor"
      : "Modifica la información del profesor";
  const defaultSubmitLabel = mode === "create" ? "Crear Profesor" : "Guardar Cambios";
  const defaultSubmittingLabel = mode === "create" ? "Creando..." : "Guardando...";
  const defaultError = mode === "create"
    ? "Error al crear el profesor. Por favor, intenta de nuevo."
    : "Error al actualizar el profesor. Por favor, intenta de nuevo.";

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setLoadingUniversities(true);
        const list = await universitiesService.list();
        setUniversities(list);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error al cargar universidades";
        setError(message);
      } finally {
        setLoadingUniversities(false);
      }
    };
    loadUniversities();
  }, []);

  useEffect(() => {
    if (mode === "edit" && professorId) {
      const fetchProfessor = async () => {
        try {
          setLoading(true);
          setError(null);
          const p = await professorsService.getById(professorId);
          const data = {
            name: p.name || "",
            department: p.department || "",
            universityId: p.university?.id || p.universityId || "",
          };
          setFormData(data);
          setInitialData(data);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Error al cargar el profesor";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchProfessor();
    }
  }, [mode, professorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    const name = formData.name.trim();
    const department = formData.department.trim();

    if (!name) return "El nombre del profesor es requerido";
    if (name.length < 2) return "El nombre debe tener al menos 2 caracteres";
    if (name.length > 120) return "El nombre no puede exceder 120 caracteres";

    if (!department) return "El departamento es requerido";
    if (department.length < 2) return "El departamento debe tener al menos 2 caracteres";
    if (department.length > 100) return "El departamento no puede exceder 100 caracteres";

    if (!formData.universityId) return "La universidad es requerida";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        setSubmitting(false);
        return;
      }

      if (mode === "create") {
        const data: CreateProfessorData = {
          name: formData.name.trim(),
          department: formData.department.trim(),
          university: formData.universityId,
        };
        const professor = await professorsService.create(data);
        setFormData({ name: "", department: "", universityId: "" });
        if (onSuccess) onSuccess(professor);
      } else {
        if (!professorId) {
          setError("ID de profesor no proporcionado");
          setSubmitting(false);
          return;
        }

        const updates: UpdateProfessorData = {};
        const name = formData.name.trim();
        const department = formData.department.trim();

        if (name !== initialData.name) {
          updates.name = name;
        }
        if (department !== initialData.department) {
          updates.department = department;
        }
        if (formData.universityId !== initialData.universityId) {
          updates.university = formData.universityId;
        }

        if (Object.keys(updates).length === 0) {
          setError("No se detectaron cambios");
          setSubmitting(false);
          return;
        }

        const professor = await professorsService.update(professorId, updates);
        if (onSuccess) onSuccess(professor);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : defaultError;
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-slate-600">Cargando profesor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title || defaultTitle}</CardTitle>
        <p className="text-sm text-slate-600 mt-1">{description || defaultDescription}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <Input
            label="Nombre del Profesor *"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            required
            disabled={submitting}
            minLength={2}
            maxLength={120}
          />

          <Input
            label="Departamento *"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Ej: Ingeniería de Sistemas"
            disabled={submitting}
            maxLength={120}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Universidad *</label>
            <select
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              disabled={submitting || loadingUniversities}
              required
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">Sin asignar</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={submitting} size="lg">
              {submitting ? (submittingLabel || defaultSubmittingLabel) : (submitLabel || defaultSubmitLabel)}
            </Button>
            {onCancel && (
              <Button type="button" onClick={onCancel} variant="outline" disabled={submitting} size="lg">
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
