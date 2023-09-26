import { RawResponse, ApiResponse } from "types";

declare global {
  namespace Express {
    interface Response {
      api(response: RawResponse): ApiResponse;
      message(text?: string): void;
    }
  }
}