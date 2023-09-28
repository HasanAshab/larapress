import { Request } from "~/core/express";
import Validator from "Validator";

export default class SendOtpRequest extends Request {
  body!: { 
    userId: string;
  };
  
  protected rules() {
    return {
      userId: Validator.string().required()
    }
  }
}
