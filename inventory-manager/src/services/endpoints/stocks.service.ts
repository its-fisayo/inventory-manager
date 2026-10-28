import api from "../api/client";
import type { StocksDTO, StockListResponse, StockMovementDTO, StockMovementListResponse } from "../../types/stocks.types";

// GET ALL
export const getStocks = async (
    page: number,
    pageSize: number,
    search: string,
    lowStockOnly: boolean
): Promise<StockListResponse> => {
    const res =  await api.get<StockListResponse>(
        "/api/Stocks", {
            params: {page, pageSize, search, lowStockOnly}
        }
    )

    return res.data;
};

// GET BY ID
export const getStockById = async (id: string): Promise<StocksDTO> => {
    const res = await api.get<StocksDTO>(`/api/Stocks/product/${id}`);

    return res.data;
};

export const updateStockThreshold = async (id: string, data: {lowStockThreshold: number}) => {
    return api.patch(`/api/Stocks/product/${id}/threshold`, data);
};
// GET ALL MOVEMENTS
export const getStockMovements = async (page: number, pageSize: number, search: string):
Promise<StockMovementListResponse> => {
    const res = await api.get<StockMovementListResponse>(
        "/api/Stocks/Movements", {
            params: {page, pageSize, search}
        }
    )

    return res.data;
};

// GET BY ID
export const getStockMovementById = async (id: string): Promise<StockMovementDTO> => {
    const res = await api.get<StockMovementDTO>(`/api/Stocks/movement/${id}`);

    return res.data;
};