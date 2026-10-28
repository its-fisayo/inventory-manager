export interface UserDTO {
  id: string;
  fullName: string;
  staffId: string;
  role: string;
  email: string;
  isActive: boolean;
}

export interface UserUI {
  id: string;
  fullName: string;
  staffId: string;
  role: string;
  email: string;
  isActive: boolean;
}

export interface UserListResponse {
  data: UserDTO[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}