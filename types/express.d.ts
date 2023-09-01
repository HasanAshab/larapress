import { Request } from "express";
import { IUser } from "app/models/User";
import { RawResponse } from "types";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
    interface Response {
      api(response: RawResponse): void;
    }
  }
}