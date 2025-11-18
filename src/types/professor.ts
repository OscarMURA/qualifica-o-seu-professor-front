import type { University } from "./university";
import type { User } from "./user";

export interface Professor {
  id: string;
  name: string;
  department?: string;
  bio?: string;
  universityId?: string | null;
  university?: Pick<University, "id" | "name" | "city" | "country"> | null;
  averageRating?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentItem {
  id: string;
  content: string;
  rating: number; // 1-5
  professorId: string;
  userId: string;
  author?: Pick<User, "id" | "name" | "email">;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  professorId: string;
  rating: number;
  content: string;
}

