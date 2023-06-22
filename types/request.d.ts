import { Request } from "express";
import { IUser } from "app/models/User";
import { RawResponse } from "types";

declare global {
  namespace Express {
    interface Request {
      fullUrl(): string;
      user?: IUser;
      validated: Record<string, string>;
      hasValidSignature(): boolean;
    }
    
    interface Response {
      api(response: RawResponse): void;
    }
  }
}