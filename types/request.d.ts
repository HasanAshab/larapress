import { Request } from "express";
import { IUser } from "app/models/User";
import { RawResponse } from "types";


import { Schema } from 'mongoose';

declare module 'mongoose' {
  interface Schema {
    modelName: string;
  }
}

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