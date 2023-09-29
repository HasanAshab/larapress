import { Request } from "~/core/express";
import Validator from "Validator";

export default class CreateContactRequest extends Request {
  body!: { 
    email: string;
    subject: string;
    message: string;
  };
  
  protected rules() {
    return {
      email: Validator.string().email().required(),
      subject: Validator.string().min(5).max(72).sanitize().required(),
      message: Validator.string().min(20).max(300).sanitize().required()
    }
  }
}
