export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      ME: "/auth/me",
    },
    USERS: "/users",
    UNIVERSITIES: "/universities",
    PROFESSORS: "/professors",
    COMMENTS: "/comments",
  },
} as const;

