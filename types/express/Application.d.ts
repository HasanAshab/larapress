import { UploadedFile } from "express-fileupload";
import { RawResponse, ApiResponse } from "types";

declare module "express" {
  interface Request {
    files: Record<string, UploadedFile | UploadedFile[]>;
    fullUrl(): string;
  }
  
  interface Response {
    message(text?: string): void;
    api(response: RawResponse): void;
  }
  
  interface Application {
    request: Request;
    response: Response;
  }
}