import { Request } from "~/core/express";
import Validator from "Validator";

export default class LoginRequest extends Request {
  body!: { 
    email: string;
    password: string;
    otp?: string;
  };
  
  static rules() {
    return {
      email: Validator.string().email().required(),
      password: Validator.string().required(),
      otp: Validator.string()
    }
  }
}
