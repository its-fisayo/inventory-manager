import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/endpoints/product.services";

import type {
  ProductDTO,
  ProductListResponse,
  ProductUI,
  CreateProductRequest
} from "../types/products.types";

// Normalize API → UI
const normalize = (data: ProductDTO[]): ProductUI[] =>
  data.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.categoryName,
    brand: p.brandName,
    description: p.description
  }));

type UpdateProductInput = {
  id: string;
  data: Omit<ProductDTO, "id">;
};

export const useProducts = (page: number, pageSize: number, search: string) => {
  const queryClient = useQueryClient();

  // GET ALL
  const productQuery = useQuery<ProductListResponse>({
    queryKey: ["products", page, pageSize, search],
    queryFn: () => getProducts(page, pageSize, search)
  });

  // GET BY ID
  const fetchProductById = async (id: string): Promise<ProductDTO> => {
    const res = await getProductById(id);
    return res;
  };

  // CREATE
  const addProductMutation = useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // UPDATE
  const editProductMutation = useMutation({
    mutationFn: ({ id, data }: UpdateProductInput) => updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // DELETE
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    products: normalize(productQuery.data?.data ?? []),
    totalItems: productQuery.data?.totalCount ?? 0,
    loading: productQuery.isLoading,

    fetchProductById,

    addProduct: addProductMutation.mutateAsync,
    editProduct: editProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
  };
};
