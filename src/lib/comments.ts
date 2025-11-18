import { api } from "./api";
import type { Comment, CreateCommentDto, UpdateCommentDto } from "@/types/comment";

export const getMyComments = async (): Promise<Comment[]> => {
  const response = await api.get<Comment[]>("/comments/me");
  return response.data || [];
};

export const updateComment = async (id: string, data: UpdateCommentDto): Promise<Comment> => {
  const response = await api.patch<Comment>(`/comments/${id}`, data);
  return response.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await api.delete(`/comments/${id}`);
};
