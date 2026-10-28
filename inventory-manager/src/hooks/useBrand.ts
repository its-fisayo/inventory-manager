import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBrands,
  createBrand,
  updateBrand,
} from "../services/endpoints/brand.service";
import type {
  BrandDTO,
  BrandUI
} from "../types/brand.types";

const normalize = (data: BrandDTO[]): BrandUI[] =>
  data.map((c) => ({
    id: c.id,
    name: c.name
  }));

type CreateBrandInput = Omit<BrandDTO, "id">;

type UpdateBrandInput = {
  id: string;
  data: Omit<BrandDTO, "id">;
};

export const useBrand = (search = "") => {
    const queryClient = useQueryClient();

    // GET ALL
    const brandsQuery = useQuery<BrandDTO[]>({
        queryKey: ["brands", search],
        queryFn: () => getBrands(search),
    });

    // CREATE
    const addBrandMutation = useMutation({
        mutationFn: (data: CreateBrandInput) => createBrand(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });

    //UPDATE
    const editBrandMutation = useMutation({
        mutationFn: ({ id, data }: UpdateBrandInput) => 
            updateBrand(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });

    return {
        brands: normalize(brandsQuery.data ?? []),
        loading: brandsQuery.isLoading,
        addBrand: addBrandMutation.mutateAsync,
        editBrand: editBrandMutation.mutateAsync
    };
};