import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
} from "../services/endpoints/category.service";
import type {
  CategoryDTO,
  CategoryUI
} from "../types/category.types";

const normalize = (data: CategoryDTO[]): CategoryUI[] =>
  data.map((c) => ({
    id: c.id,
    name: c.name
  }));

type CreateCategoryInput = Omit<CategoryDTO, "id">;

type UpdateCategoryInput = {
  id: string;
  data: Omit<CategoryDTO, "id">;
};

export const useCategory = (search = "") => {
    const queryClient = useQueryClient();

    // GET ALL
    const categoriesQuery = useQuery<CategoryDTO[]>({
        queryKey: ["categories", search],
        queryFn: () => getCategories(search),
    });

    // CREATE
    const addCategoryMutation = useMutation({
        mutationFn: (data: CreateCategoryInput) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    //UPDATE
    const editCategoryMutation = useMutation({
        mutationFn: ({ id, data }: UpdateCategoryInput) => 
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return {
        categories: normalize(categoriesQuery.data ?? []),
        loading: categoriesQuery.isLoading,
        addCategory: addCategoryMutation.mutateAsync,
        editCategory: editCategoryMutation.mutateAsync
    };
};