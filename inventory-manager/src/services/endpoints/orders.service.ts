import api from "../api/client";
import type {
  OrderDTO,
  OrderListResponse,
  CreateOrderRequest,
} from "../../types/orders.types";

export const getOrders = async (
  page: number,
  pageSize: number,
  search: string,
): Promise<OrderListResponse> => {
  const res = await api.get<OrderListResponse>("/api/Orders", {
    params: { page, pageSize, search },
  });

  return res.data;
};

export const createOrder = async (data: CreateOrderRequest) => {
  const res = await api.post("/api/Orders", data);

  return res.data;
};

export const getOrderById = async (id: string): Promise<OrderDTO> => {
  const res = await api.get<OrderDTO>(`/api/Orders/${id}`);
  
  return res.data;
};
