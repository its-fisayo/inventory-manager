export const Role = {
  USER: "User",
  ADMIN: "Admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];