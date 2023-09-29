import { Request } from "~/core/express";
import Validator from "Validator";

export default class LoginWithRecoveryCodeRequest extends Request {
  body!: { 
    email: string;
    code: string;
  };
  
  protected rules() {
    return {
      email: Validator.string().email().required(),
      code: Validator.string().required()
    }
  }
}
