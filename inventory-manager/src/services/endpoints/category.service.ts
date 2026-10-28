import api from "../api/client";

import type { CategoryDTO } from "../../types/category.types";

export const getCategories = async (search?: string) => {
    const res = await api.get<CategoryDTO[]>(
        '/api/Categories',
        {
            params: search?.trim() ? {search: search.trim()} : {},
        }
    );
    return res.data;
};

export const createCategory = async (data: Omit<CategoryDTO, "id">) => {
    const res = await api.post("/api/Categories", data);
    return res.data;
};

export const updateCategory = async (
    id: string,
    data: Omit<CategoryDTO, "id">
) => {
    const res = await api.put(`/api/Categories/${id}`, data);
    return res.data;
}