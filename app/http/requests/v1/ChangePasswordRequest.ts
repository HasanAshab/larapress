import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";

export default class ChangePasswordRequest extends AuthenticRequest {
  body!: { 
    oldPassword: string;
    newPassword: string;
  };
  
  static rules() {
    return {
      oldPassword: Validator.string().required(),
      newPassword: Validator.string()
        .min(8)
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/)
        .message('{#label} must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)')
        .required()
    }
  }
}
