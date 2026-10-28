import { useQuery } from "@tanstack/react-query";
import {
  getStockMovementById,
  getStockMovements,
} from "../services/endpoints/stocks.service";
import type {
  StockMovementListResponse,
  StockMovementUI,
  StockMovementDTO,
} from "../types/stocks.types";

// Normalize API to UI
const normalize = (data: StockMovementDTO[]): StockMovementUI[] =>
  data.map((sm) => ({
    id: sm.id,
    productName: sm.productName,
    quantityChange: sm.quantityChange,
    movementType: sm.movementType,
    orderNumber: sm.orderNumber,
    recipientName: sm.recipientName,
    performedByUserName: sm.performedByUserName,
    createdAt: sm.createdAt,
  }));

export const useSTockMovements = (
  page: number,
  pageSize: number,
  search: string,
) => {
  // GET ALL
  const stockMovementsQuery = useQuery<StockMovementListResponse>({
    queryKey: ["stockMoevements", page, pageSize, search],
    queryFn: () => getStockMovements(page, pageSize, search),
  });

  // GET BY ID
  const fetchStockMovememtnById = async (
    id: string,
  ): Promise<StockMovementDTO> => {
    const res = await getStockMovementById(id);

    return res;
  };

  return {
    stockMovements: normalize(stockMovementsQuery.data?.data ?? []),
    totalItems: stockMovementsQuery.data?.totalCount ?? 0,
    loading: stockMovementsQuery.isLoading,

    fetchStockMovememtnById,
  };
};
