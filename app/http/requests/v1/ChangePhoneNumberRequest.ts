import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";

export default class ChangePhoneNumberRequest extends AuthenticRequest {
  body!: { 
    phoneNumber: string;
    otp?: string;
  };
  

  static rules() {
    return {
      phoneNumber: Validator.string().required(),
      otp: Validator.string()
    }
  }
}
