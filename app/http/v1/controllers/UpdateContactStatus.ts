import { Request } from "~/core/express";
import Validator from "Validator";

export default class UpdateContactStatus extends Request {
  body!: { 
    status: "opened" | "closed";
  };
  
  protected rules() {
    return {
      status: Validator.string().valid("opened", "closed").required()
    }
  }
}
