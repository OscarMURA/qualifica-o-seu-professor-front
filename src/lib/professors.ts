import { api } from "./api";
import { API_CONFIG } from "@/config/api";
import type { Professor, CommentItem } from "@/types";

export interface CreateProfessorCommentData {
  professorId: string;
  rating: number; // 1-5
  content: string;
}

export interface CreateProfessorData {
  name: string;
  department: string;
  university: string;
}

export interface UpdateProfessorData {
  name?: string;
  department?: string;
  university?: string;
}

export interface ProfessorRating {
  average: number;
  count: number;
}

interface CommentFromApi {
  id: string;
  content: string;
  rating: number | null;
  professorId: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const mapCommentFromApi = (comment: CommentFromApi): CommentItem => ({
  id: comment.id,
  content: comment.content,
  rating: comment.rating ?? 0,
  professorId: comment.professorId,
  userId: comment.studentId,
  author: comment.student
    ? {
        id: comment.student.id,
        name: comment.student.name,
        email: comment.student.email,
      }
    : undefined,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});

export const professorsService = {
  async list(): Promise<Professor[]> {
    const res = await api.get<Professor[]>(API_CONFIG.ENDPOINTS.PROFESSORS);
    const professors = res.data;

    // Cargar rating promedio para cada profesor
    try {
      const ratings = await Promise.all(
        professors.map((professor) =>
          professorsService
            .getRating(professor.id)
            .catch(() => ({ average: 0, count: 0 }))
        )
      );

      return professors.map((professor, index) => ({
        ...professor,
        averageRating: ratings[index]?.average ?? 0,
      }));
    } catch {
      // Si falla el endpoint de rating, devolver sin modificar
      return professors;
    }
  },

  async getById(id: string): Promise<Professor> {
    const res = await api.get<Professor>(`${API_CONFIG.ENDPOINTS.PROFESSORS}/${id}`);
    return res.data;
  },

  async create(data: CreateProfessorData): Promise<Professor> {
    const res = await api.post<Professor>(API_CONFIG.ENDPOINTS.PROFESSORS, data);
    return res.data;
  },

  async update(id: string, data: UpdateProfessorData): Promise<Professor> {
    const res = await api.patch<Professor>(`${API_CONFIG.ENDPOINTS.PROFESSORS}/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${API_CONFIG.ENDPOINTS.PROFESSORS}/${id}`);
  },

  async getRating(professorId: string): Promise<ProfessorRating> {
    const res = await api.get<ProfessorRating>(
      `${API_CONFIG.ENDPOINTS.COMMENTS}/professor/${professorId}/rating`
    );
    return res.data;
  },

  async getComments(professorId: string): Promise<CommentItem[]> {
    const res = await api.get<CommentFromApi[]>(
      `${API_CONFIG.ENDPOINTS.COMMENTS}/professor/${professorId}/comments`
    );
    return res.data.map(mapCommentFromApi);
  },

  async addComment(data: CreateProfessorCommentData): Promise<CommentItem> {
    const payload = {
      content: data.content,
      rating: data.rating,
      professor: data.professorId,
    };
    const res = await api.post<CommentFromApi>(`${API_CONFIG.ENDPOINTS.COMMENTS}`, payload);
    return mapCommentFromApi(res.data);
  },
};
