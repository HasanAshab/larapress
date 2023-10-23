import { Request } from "~/core/express";
import Validator from "Validator";

export default class ResendEmailVerificationRequest extends Request {
  body!: { 
    email: string;
  };
  
  static rules() {
    return {
      email: Validator.string().email().required()
    }
  }
}
