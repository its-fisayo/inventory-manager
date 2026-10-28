import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../services/endpoints/vendor.service";

import type {
  VendorDTO,
  VendorUI,
  VendorListResponse,
} from "../types/vendor.types";

const normalize = (data: VendorDTO[]): VendorUI[] =>
  data.map((v) => ({
    id: v.id,
    name: v.name,
    primaryContact: v.primaryContact,
    phoneNumber: v.phoneNumber,
    email: v.email,
    isActive: v.isActive
  }));

type CreateVendorInput = Omit<VendorDTO, "id">;

type UpdateVendorInput = {
  id: string;
  data: Omit<VendorDTO, "id">;
};

export const useVendors = (page: number, pageSize: number, search: string) => {
  const queryClient = useQueryClient();

  // GET ALL
  const vendorsQuery = useQuery<VendorListResponse>({
    queryKey: ["vendors", page, pageSize, search],
    queryFn: () => getVendors(page, pageSize, search)
  });

  // GET BY ID
  const fetchVendorById = async (id: string): Promise<VendorDTO> => {
    const res = await getVendorById(id);
    return res;
  };

  // CREATE
  const addVendorMutation = useMutation({
    mutationFn: (data: CreateVendorInput) => createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });

  // UPDATE
  const editVendorMutation = useMutation({
    mutationFn: ({ id, data }: UpdateVendorInput) =>
      updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });

  // DELETE
  const deleteVendorMutation = useMutation({
    mutationFn: (id: string) => deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });

  return {
    vendors: normalize(vendorsQuery.data?.data ?? []),
    totalItems: vendorsQuery.data?.totalCount ?? 0,
    loading: vendorsQuery.isLoading,

    fetchVendorById,

    addVendor: addVendorMutation.mutateAsync,
    editVendor: editVendorMutation.mutateAsync,
    deleteVendor: deleteVendorMutation.mutateAsync,
  };
};