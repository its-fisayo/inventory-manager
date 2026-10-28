import { useMutation } from "@tanstack/react-query";
import { getFilesByProductId, uploadFile } from "../services/endpoints/file.service";
import type { UploadFileRequest } from "../types/file.types";
import type { FileDTO } from "../types/file.types";

export const useFiles = () => {
  const uploadFileMutation = useMutation({
    mutationFn: ({ productId, file }: UploadFileRequest) =>
      uploadFile(productId, file),
  });

  const fetchFilesByProductId = async (id: string): Promise<FileDTO[]> => {
    const res = await getFilesByProductId(id);
    return res;
  }
  return {
    uploadFile: uploadFileMutation.mutateAsync,
    isUploading: uploadFileMutation.isPending,

    fetchFilesByProductId
  };
};
