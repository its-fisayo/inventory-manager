import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserRole, updateUserStatus } from "../services/endpoints/user.service";
import type { UserDTO, UserUI } from "../types/users.types";

const normalize = (data: UserDTO[]): UserUI[] =>
  data.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    staffId: u.staffId,
    isActive: u.isActive,
  }));

type UpdateUserRoleInput = {
  id: string;
  data: { role: string };
};

type UpdateUserStatusInput = {
  id: string;
  data: {isActive: boolean};
};

export const useUsers = (page: number, pageSize: number, search: string) => {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["users", page, pageSize, search],
    queryFn: () => getUsers(page, pageSize, search),
  });

  const editUserRoleMutation = useMutation({
    mutationFn: ({ id, data }: UpdateUserRoleInput) => updateUserRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  
  const editUserStatusMutation = useMutation({
    mutationFn: ({ id, data }: UpdateUserStatusInput) => updateUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: normalize(userQuery.data?.data ?? []),
    totalItems: userQuery.data?.totalCount ?? 0,
    currentPage: userQuery.data?.page ?? page,
    totalPages: userQuery.data?.totalPages ?? 1,
    totalCount: userQuery.data?.totalCount ?? 0,
    loading: userQuery.isLoading,
    error: userQuery.error,

    editUserRole: editUserRoleMutation.mutateAsync,
    editUserStatus: editUserStatusMutation.mutateAsync
  };
};
