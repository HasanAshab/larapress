import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";

export default class UpdateContactStatusRequest extends AuthenticRequest {
  body!: { 
    status: "opened" | "closed";
  };
  
  static rules() {
    return {
      status: Validator.string().valid("opened", "closed").required(),
    }
  }
}
