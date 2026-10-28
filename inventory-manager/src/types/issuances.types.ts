export interface IssuanceItemDTO {
    id: string;
    productId: CreateIssuanceItemRequest["productId"];
    productName: string;
    barcode: CreateIssuanceItemRequest["barcode"];
    serialNumber: CreateIssuanceItemRequest["serialNumber"];
}

export interface CreateIssuanceItemRequest {
    productId: string;
    barcode: string;
    serialNumber: string;
}

export interface IssuanceDTO {
    id: string;
    recipientName: string;
    issuedByUserId: string;
    issuesByUserName: string;
    issuedAt: string;
    notes: string;
    totalItems: number;
    items: IssuanceItemDTO[];
}

export interface IssuanceUI {
    id: string;
    recipientName: string;
    issuedByUserName: string;
    issuedAt: string;
    totalItems: number;
}

export interface IssuanceListResponse {
    data: IssuanceDTO[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPAges: number;
}

export interface CreateIssuanceRequest {
    recipientName: string;
    notes: string;
    items: CreateIssuanceItemRequest[];
}