export interface OrderItemDTO {
  id: string;
  productId: CreateOrderItemRequest["productId"];
  quantity: CreateOrderItemRequest["quantity"];
  unitPrice: CreateOrderItemRequest["unitPrice"];
  productName: string;
  totalPrice: number;
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  orderItems: OrderItemDTO[];
}

export interface OrderUI {
  id: string;
  orderNumber: string;
  vendorName: string;
  orderDate: string;
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
  createdByUserName: string;
}

export interface OrderListResponse {
  data: OrderDTO[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateOrderRequest {
  vendorId: string;
  orderDate: string;
  orderItems: CreateOrderItemRequest[];
}
