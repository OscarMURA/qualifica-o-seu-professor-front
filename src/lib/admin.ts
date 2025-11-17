import { api } from "./api";
import type { AdminStats } from "@/types/admin";

export const getAdminStats = async (): Promise<AdminStats> => {
  const [users, professors, universities, comments] = await Promise.all([
    api.get<any[]>("/users"),
    api.get<any[]>("/professors"),
    api.get<any[]>("/universities"),
    api.get<any[]>("/comments"),
  ]);

  return {
    totalUsers: users.data?.length || 0,
    totalProfessors: professors.data?.length || 0,
    totalUniversities: universities.data?.length || 0,
    totalComments: comments.data?.length || 0,
  };
};
