export interface ProductDTO {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  description: string;
}
export interface CreateProductRequest {
  name: string;
  brandId: string;
  categoryId: string;
  description: string;
}

export interface ProductUI {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string
}

export interface ProductListResponse {
  data: ProductDTO[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
