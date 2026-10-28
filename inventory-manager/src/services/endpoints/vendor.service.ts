import api from "../api/client";

import type { VendorDTO, VendorListResponse } from "../../types/vendor.types";

export const getVendors = async (page: number, pageSize: number, search: string) => {
  const res = await api.get<VendorListResponse>(
    "/api/Vendors", {
      params: {page, pageSize, search}
    }
  );
  return res.data;
};

export const createVendor = async (data: Omit<VendorDTO, "id">) => {
  const res = await api.post("/api/Vendors", data);
  return res.data;
};

export const getVendorById = async (id: string) => {
  const res = await api.get<VendorDTO>(`/api/Vendors/${id}`);
  return res.data;
};

export const updateVendor = async (
  id: string,
  data: Omit<VendorDTO, "id">
) => {
  return api.put(`/api/Vendors/${id}`, data);
};

export const deleteVendor = async (id: string) => {
  return api.delete(`/api/Vendors/${id}`);
};