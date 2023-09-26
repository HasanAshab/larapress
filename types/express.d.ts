import { IUser } from "~/app/models/User";
import { RawResponse, ApiResponse } from "types";

declare global {
  namespace Express {
/*    interface Request {
      user: IUser;
    }*/
    interface Response {
      api(response: RawResponse): ApiResponse;
      message(text?: string): void;
    }
  }
}