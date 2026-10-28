import api from "../api/client";
import type {
  IssuanceDTO,
  IssuanceListResponse,
  CreateIssuanceRequest,
} from "../../types/issuances.types";

export const getIssuances = async (
  page: number,
  pageSize: number,
  search: string,
): Promise<IssuanceListResponse> => {
  const res = await api.get<IssuanceListResponse>("/api/Issuances", {
    params: { page, pageSize, search },
  });

  return res.data;
};

export const createIssuance = async (data: CreateIssuanceRequest) => {
    const res = await api.post("/api/Issuances", data);

    return res.data;
};

export const getIssuanceById = async (id: string): Promise<IssuanceDTO> => {
    const res = await api.get<IssuanceDTO>(`/api/Issuances/${id}`);

    return res.data;
};
