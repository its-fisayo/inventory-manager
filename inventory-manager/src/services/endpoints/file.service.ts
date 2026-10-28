import api from "../api/client";
import type { FileDTO } from "../../types/file.types";

export const uploadFile = async (productId: string, file: File) => {
  const formData = new FormData();

  formData.append("File", file);

  const res = await api.post("/api/Files/upload", formData, {
    params: { productId },
  });

  return res.data;
};

export const getFilesByProductId = async (id: string): Promise<FileDTO[]> => {
const res = await api.get<FileDTO[]>(`/api/Files/product/${id}`);

return res.data;
}