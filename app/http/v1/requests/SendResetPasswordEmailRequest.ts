import { Request } from "~/core/express";
import Validator from "Validator";

export default class SendResetPasswordEmailRequest extends Request {
  body!: { 
    email: string;
  };
  
  protected rules() {
    return {
      email: Validator.string().email().required()
    }
  }
}
