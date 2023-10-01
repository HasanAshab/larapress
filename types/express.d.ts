import { RawResponse, ApiResponse } from "types";

declare global {
  namespace Express {
    interface Response {
      api(response: RawResponse): void;
      message(text?: string): void;
    }
  }
}