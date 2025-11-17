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
  department?: string;
  universityId?: string | null;
}

export interface UpdateProfessorData {
  name?: string;
  department?: string | null;
  universityId?: string | null;
}

export const professorsService = {
  async list(): Promise<Professor[]> {
    const res = await api.get<Professor[]>(API_CONFIG.ENDPOINTS.PROFESSORS);
    return res.data;
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

  async getComments(professorId: string): Promise<CommentItem[]> {
    // Asumimos endpoint de consulta por query param
    const res = await api.get<CommentItem[]>(`${API_CONFIG.ENDPOINTS.COMMENTS}`, {
      params: { professorId },
    });
    return res.data;
  },

  async addComment(data: CreateProfessorCommentData): Promise<CommentItem> {
    const res = await api.post<CommentItem>(`${API_CONFIG.ENDPOINTS.COMMENTS}`, data);
    return res.data;
  },
};
