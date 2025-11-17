export interface Comment {
  id: string;
  content: string;
  rating?: number;
  professorId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
  professor?: {
    id: string;
    name: string;
    department: string;
  };
}

export interface CreateCommentDto {
  content: string;
  rating?: number;
  professorId: string;
}

export interface UpdateCommentDto {
  content?: string;
  rating?: number;
}
