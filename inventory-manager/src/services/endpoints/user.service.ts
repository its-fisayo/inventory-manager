// services/users.service.ts
import api from "../api/client";
import type { UserListResponse } from "../../types/users.types";

export const getUsers = async (
  page: number,
  pageSize: number,
  search: string,
) => {
  const res = await api.get<UserListResponse>("/api/User", {
    params: { page, pageSize, search },
  });

  return res.data;
};

export const updateUserRole = async (id: string, data: {role: string}) => {
  return api.patch(`api/User/${id}/role`, data);
};

export const updateUserStatus = async (id: string, data: {status: boolean}) => {
  return api.patch(`api/User/${id}/status`, data);
};