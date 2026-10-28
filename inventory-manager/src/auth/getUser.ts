import { type Role } from "./role";

export interface LoggedInUser {
  token: string;
  fullName: string;
  staffID: string;
  email: string;
  role: Role;
}

export function getUser(): LoggedInUser | null {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user) as LoggedInUser;
}