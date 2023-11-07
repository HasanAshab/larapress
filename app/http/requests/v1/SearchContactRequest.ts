import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";

// TODO incapsulate pagination validation
export default class SearchContactRequest extends AuthenticRequest {
  query!: { 
    q: string;
    status?: "opened" | "closed";
    limit?: number;
    cursor?: string;
  };

  static rules() {
    return {
      q: Validator.string().required(),
      status: Validator.string().valid("opened", "closed"),
      limit: Validator.number(),
      cursor: Validator.string()
    }
  }
}
