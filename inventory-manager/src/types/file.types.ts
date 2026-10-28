export interface UploadFileRequest {
  productId: string;
  file: File;
}

export interface FileDTO {
  id: string;
  productId: string;
  fileName: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
}