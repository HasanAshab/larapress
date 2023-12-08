import { UploadedFile } from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      files: Record<string, UploadedFile | UploadedFile[]>;
      fullUrl: string;
      hasValidSignature: boolean;
    }

    interface Response {
      json(data: string | object): void;
      message(text?: string): void;
      redirectToClient(path?: string): void;
      sendFileFromStorage(storagePath: string): void;
    }
  }
}