import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";

export default class ChangePasswordRequest extends AuthenticRequest {
  body!: { 
    oldPassword: string;
    password: string;
  };
  
  protected rules() {
    return {
      oldPassword: Validator.string().required(),
      password: Validator.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$/)
        .message('"{#label}" must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)')
        .required()
    }
  }
}
