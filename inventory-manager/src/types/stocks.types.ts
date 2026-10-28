export interface StocksDTO {
  id: string;
  productId: string;
  productName: string;
  category: string;
  brand: string;
  quantityAvailable: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  lastUpdatedAt: string;
}

export interface StocksUI {
  id: string;
  productId: string;
  productName: string;
  category: string;
  brand: string;
  quantityAvailable: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface StockListResponse {
  data: StocksDTO[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface StockMovementDTO {
  id: string;
  productId: string;
  productName: string;
  quantityChange: number;
  movementType: string;
  orderId: string;
  orderNumber: string;
  issuanceId: string;
  recipientName: string;
  performedByUserId: string;
  performedByUserName: string;
  notes: string;
  createdAt: string;
}

export interface StockMovementUI {
  id: string;
  productName: string;
  quantityChange: number;
  movementType: string;
  orderNumber: string;
  recipientName: string;
  performedByUserName: string;
  createdAt: string;
}

export interface StockMovementListResponse {
  data: StockMovementDTO[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}