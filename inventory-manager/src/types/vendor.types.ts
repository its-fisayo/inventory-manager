export interface VendorDTO {
  id: string;
  name: string;
  primaryContact: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
}

export interface VendorUI {
  id: string;
  name: string;
  primaryContact: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
}

export interface VendorListResponse {
  data: VendorDTO[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}