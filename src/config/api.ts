export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      ME: "/auth/me",
      VERIFY_EMAIL: "/auth/verify-email",
      RESEND_VERIFICATION: "/auth/resend-verification",
    },
    USERS: "/users",
    UNIVERSITIES: "/universities",
    PROFESSORS: "/professors",
    COMMENTS: "/comments",
  },
} as const;

