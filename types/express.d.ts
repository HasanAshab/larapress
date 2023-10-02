import { UploadedFile } from "express-fileupload";
import { RawResponse, ApiResponse } from "types";

declare global {
  namespace Express {
    interface Request {
      files: Record<string, UploadedFile | UploadedFile[]>;
    }
    interface Response {
      api(response: RawResponse): void;
      message(text?: string): void;
    }
  }
}