import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStocks, getStockById, updateStockThreshold } from "../services/endpoints/stocks.service";
import type {
  StockListResponse,
  StocksDTO,
  StocksUI,
} from "../types/stocks.types";

// Normalize API to UI
const normalize = (data: StocksDTO[]): StocksUI[] =>
  data.map((s) => ({
    id: s.id,
    productId: s.productId,
    productName: s.productName,
    category: s.category,
    brand: s.brand,
    quantityAvailable: s.quantityAvailable,
    lowStockThreshold: s.lowStockThreshold,
    isLowStock: s.isLowStock
  }));

  type UpdateThresholdInput = {
    id: string;
    data: {lowStockThreshold: number};
  }
export const useStocks = (
  page: number,
  pageSize: number,
  search: string,
  lowStockOnly: boolean
) => {
  const queryClient = useQueryClient();
  //GET ALL
  const stocksQuery = useQuery<StockListResponse>({
    queryKey: ["stocks", page, pageSize, search, lowStockOnly],
    queryFn: () => getStocks(page, pageSize, search, lowStockOnly)
  });

  // GET BY ID
  const fetchStockByID = async (id: string): Promise<StocksDTO> => {
    const res = await getStockById(id);
    return res;
  };

  // UPDATE THRESHOLD
  const editStockThresholdMutation = useMutation({
    mutationFn: ({id, data}: UpdateThresholdInput) => updateStockThreshold(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["stocks"]});
    }
  });

  return {
    stocks: normalize(stocksQuery.data?.data ?? []),
    totalItems: stocksQuery.data?.totalCount ?? 0,
    loading: stocksQuery.isLoading,

    fetchStockByID,
    editStockThreshold: editStockThresholdMutation.mutateAsync
  };
};
