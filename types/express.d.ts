import { UploadedFile } from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      fullUrl: string;
      _hasValidSignature?: boolean;
      hasValidSignature: boolean;
      file(name: string): null | UploadedFile | UploadedFile[];
      hasFile(name: string): boolean;
    }

    interface Response {
      json(data: string | object): void;
      message(text?: string): void;
      redirectToClient(path?: string): void;
      sendFileFromStorage(storagePath: string): void;
    }
  }
}