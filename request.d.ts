import { Request } from 'express';
import { IUser } from "app/models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      validated: Record<string, string>;
    }
  }
}