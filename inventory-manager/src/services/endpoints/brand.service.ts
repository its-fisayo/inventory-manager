import api from "../api/client";

import type { BrandDTO } from "../../types/brand.types";

export const getBrands = async (search: string) => {
    const res = await api.get<BrandDTO[]>(
        '/api/Brands',
        {
        params: search?.trim() ? {search: search.trim()} : {},
        }
    );
    return res.data;
};

export const createBrand = async (data: Omit<BrandDTO, "id">) => {
    const res = await api.post("/api/Brands", data);
    return res.data;
};

export const updateBrand = async (
    id: string,
    data: Omit<BrandDTO, "id">
) => {
    const res = await api.put(`/api/Brands/${id}`, data);
    return res.data;
}