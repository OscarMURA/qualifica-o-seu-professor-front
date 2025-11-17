import { api } from "./api";
import type { ProfileData, UserProfile } from "@/types/profile";

export const getProfile = async (): Promise<ProfileData> => {
  const userResponse = await api.get<UserProfile>("/users/me");
  
  let totalComments = 0;
  try {
    const commentsResponse = await api.get<any>("/comments/me");
    totalComments = commentsResponse.data?.total || 
                   commentsResponse.data?.data?.length || 
                   (Array.isArray(commentsResponse.data) ? commentsResponse.data.length : 0);
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
