"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import {
    universitiesService,
    type CreateUniversityData,
    type UpdateUniversityData,
} from "@/lib/universities";
import type { University } from "@/types";
import { useEffect, useState } from "react";

interface UniversityFormProps {
  mode: "create" | "edit";
  universityId?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  submittingLabel?: string;
  onSuccess?: (university: University) => void;
  onCancel?: () => void;
}

export default function UniversityForm({
  mode,
  universityId,
  title,
  description,
  submitLabel,
  submittingLabel,
  onSuccess,
  onCancel,
}: UniversityFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
  });
  const [initialData, setInitialData] = useState({
    name: "",
    country: "",
    city: "",
  });
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valores por defecto
  const defaultTitle = mode === "create" ? "Crear Nueva Universidad" : "Editar Universidad";
  const defaultDescription =
    mode === "create"
      ? "Completa el formulario para agregar una nueva universidad a la plataforma"
      : "Modifica la información de la universidad";
  const defaultSubmitLabel = mode === "create" ? "Crear Universidad" : "Guardar Cambios";
  const defaultSubmittingLabel = mode === "create" ? "Creando..." : "Guardando...";
  const defaultError = mode === "create"
    ? "Error al crear la universidad. Por favor, intenta de nuevo."
    : "Error al actualizar la universidad. Por favor, intenta de nuevo.";

  useEffect(() => {
    if (mode === "edit" && universityId) {
      fetchUniversity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, universityId]);

  const fetchUniversity = async () => {
    if (!universityId) return;

    try {
      setLoading(true);
      setError(null);
      const university = await universitiesService.getById(universityId);
      const data = {
        name: university.name,
        country: university.country || "",
        city: university.city || "",
      };
      setFormData(data);
      setInitialData(data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Error al cargar la universidad";
      setError(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al escribir
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "El nombre de la universidad es requerido";
    }

    if (formData.name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }

    if (formData.name.trim().length > 120) {
      return "El nombre no puede exceder 120 caracteres";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validación
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        setSubmitting(false);
        return;
      }

      if (mode === "create") {
        // Crear universidad
        const data: CreateUniversityData = {
          name: formData.name.trim(),
          ...(formData.country?.trim() && { country: formData.country.trim() }),
          ...(formData.city?.trim() && { city: formData.city.trim() }),
        };

        const university = await universitiesService.create(data);

        // Resetear formulario
        setFormData({ name: "", country: "", city: "" });

        if (onSuccess) {
          onSuccess(university);
        }
      } else {
        // Editar universidad
        if (!universityId) {
          setError("ID de universidad no proporcionado");
          setSubmitting(false);
          return;
        }

        // Preparar solo los campos que cambiaron
        const updates: UpdateUniversityData = {};

        if (formData.name.trim() !== initialData.name) {
          updates.name = formData.name.trim();
        }

        if (formData.country?.trim() !== initialData.country) {
          updates.country = formData.country?.trim() || undefined;
        }

        if (formData.city?.trim() !== initialData.city) {
          updates.city = formData.city?.trim() || undefined;
        }

        // Si no hay cambios
        if (Object.keys(updates).length === 0) {
          setError("No se detectaron cambios");
          setSubmitting(false);
          return;
        }

        const university = await universitiesService.update(universityId, updates);

        if (onSuccess) {
          onSuccess(university);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        defaultError;
      setError(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
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
            <p className="mt-4 text-slate-600">Cargando universidad...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title || defaultTitle}</CardTitle>
        <p className="text-sm text-slate-600 mt-1">
          {description || defaultDescription}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nombre de la Universidad *"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Universidad Icesi"
            required
            disabled={submitting}
            minLength={2}
            maxLength={120}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="País"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Ej: Colombia"
              disabled={submitting}
            />

            <Input
              label="Ciudad"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ej: Cali"
              disabled={submitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
              size="lg"
            >
              {submitting ? (submittingLabel || defaultSubmittingLabel) : (submitLabel || defaultSubmitLabel)}
            </Button>
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                disabled={submitting}
                size="lg"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

