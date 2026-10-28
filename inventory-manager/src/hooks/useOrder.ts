import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
import {
  getOrders,
  getOrderById,
  createOrder,
} from "../services/endpoints/orders.service";

import type {
  OrderDTO,
  OrderListResponse,
  OrderUI,
  CreateOrderRequest,
} from "../types/orders.types";

const normalize = (data: any[]): OrderUI[] =>
  data.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    vendorName: o.vendorName,
    orderDate: o.orderDate,
    totalItems: o.totalItems,
    totalQuantity: o.totalQuantity,
    totalPrice: o.totalPrice,
    createdByUserName: o.createdByUserName
  }));

export const useOrders = (page: number, pageSize: number, search: string) => {
  const queryClient = useQueryClient();

  // GET ALL
  const ordersQuery = useQuery<OrderListResponse>({
    queryKey: ["orders", page, pageSize, search],
    queryFn: () => getOrders(page, pageSize, search),
  });
  
  // GET BY ID
  const fetchOrderById = async (id: string): Promise<OrderDTO> => {
    const res = await getOrderById(id);
    return res;
  };

  // CREATE
  const addOrderMutation = useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders: normalize(ordersQuery.data?.data ?? []),
    totalItems: ordersQuery.data?.totalCount ?? 0,
    loading: ordersQuery.isLoading,

    fetchOrderById,

    addOrder: addOrderMutation.mutateAsync,
  };
};
