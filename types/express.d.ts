import { UploadedFile } from "express-fileupload";
import { RawResponse } from "types";
import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Application {
      request: Request;
      response: Response;
    }
    
    interface Request {
      files: Record<string, UploadedFile | UploadedFile[]>;
    }
    
    interface Response {
      api(response: RawResponse): void;
      message(text?: string): void;
      redirectToClient(path = "/"): void;
    }
  }
}