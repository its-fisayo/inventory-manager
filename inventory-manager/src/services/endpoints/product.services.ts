import api from "../api/client";
import type {
  ProductDTO,
  ProductListResponse,
  CreateProductRequest
} from "../../types/products.types";

// GET ALL
export const getProducts = async (
  page: number,
  pageSize: number,
  search: string,
): Promise<ProductListResponse> => {
  const res = await api.get<ProductListResponse>(
    "/api/Products", {
    params: {page, pageSize, search}
  }
  );

  return res.data;
};

// CREATE
export const createProduct = async (data: CreateProductRequest) => {
  const res = await api.post("/api/Products", data);

  return res.data;
};

// GET BY ID
export const getProductById = async (id: string): Promise<ProductDTO> => {
  const res = await api.get<ProductDTO>(`/api/Products/${id}`);

  return res.data;
};

// UPDATE
export const updateProduct = async (
  id: string,
  data: Omit<ProductDTO, "id">,
) => {
  return api.put(`/api/Products/${id}`, data);
};

// DELETE
export const deleteProduct = async (id: string) => {
  return api.delete(`/api/Products/${id}`);
};
