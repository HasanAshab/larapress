import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";

export default class ChangePhoneNumberRequest extends AuthenticRequest {
  body!: { 
    phoneNumber: string;
    otp?: number;
  };
  

  protected rules() {
    return {
      phoneNumber: Validator.string().required(),
      otp: Validator.number()
    }
  }
}
