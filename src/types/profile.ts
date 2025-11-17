import type { User } from "./user";

export interface UserProfile extends User {
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
}

export interface UserStats {
  totalComments: number;
}

export interface ProfileData {
  user: UserProfile;
  stats: UserStats;
}
