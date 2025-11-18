import { api } from "./api";
import type { ProfileData, UserProfile } from "@/types/profile";
import type { Comment } from "@/types/comment";

export const getProfile = async (): Promise<ProfileData> => {
  const userResponse = await api.get<UserProfile>("/users/me");
  
  let totalComments = 0;
  try {
    const commentsResponse = await api.get<Comment[]>("/comments/me");
    totalComments = commentsResponse.data?.length || 0;
  } catch (error) {
    totalComments = 0;
  }

  return {
    user: userResponse.data,
    stats: {
      totalComments,
    },
  };
};
