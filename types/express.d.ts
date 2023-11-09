import { UploadedFile } from "express-fileupload";
import { RawResponse } from "types";

declare global {
  namespace Express {
    interface Request {
      files: Record<string, UploadedFile | UploadedFile[]>;
      fullUrl(): string;
    }

    interface Response {
      message(text?: string): void;
      api(response: RawResponse): void;
      redirectToClient(path?: string): void;
    }
  }
}