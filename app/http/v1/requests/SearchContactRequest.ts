import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import config from "config";

export default class SearchContactRequest extends AuthenticRequest {
  query!: { 
    q: string;
    status?: "opened" | "closed";
    limit?: number;
    cursor?: string;
  };
  
  protected rules() {
    return {
      q: Validator.string().required(),
      status: Validator.string().valid("opened", "closed"),
      limit: Validator.number(),
      cursor: Validator.string()
    }
  }
}
