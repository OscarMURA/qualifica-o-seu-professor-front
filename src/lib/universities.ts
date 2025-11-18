import { api } from "./api";
import { API_CONFIG } from "@/config/api";
import type { University } from "@/types";

export interface CreateUniversityData {
  name: string;
  country?: string;
  city?: string;
}

export interface UpdateUniversityData {
  name?: string;
  country?: string;
  city?: string;
}

export const universitiesService = {
  async list(): Promise<University[]> {
    const response = await api.get<University[]>(API_CONFIG.ENDPOINTS.UNIVERSITIES);
    return response.data;
  },

  async create(data: CreateUniversityData): Promise<University> {
    const response = await api.post<University>(
      API_CONFIG.ENDPOINTS.UNIVERSITIES,
      data
    );
    return response.data;
  },

  async getById(id: string): Promise<University> {
    const response = await api.get<University>(
      `${API_CONFIG.ENDPOINTS.UNIVERSITIES}/${id}`
    );
    return response.data;
  },

  async update(id: string, data: UpdateUniversityData): Promise<University> {
    const response = await api.patch<University>(
      `${API_CONFIG.ENDPOINTS.UNIVERSITIES}/${id}`,
      data
    );
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${API_CONFIG.ENDPOINTS.UNIVERSITIES}/${id}`);
  },
};
