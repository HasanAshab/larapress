import { Request } from "~/core/express";
import Validator from "Validator";

export default class ResetPasswordRequest extends Request {
  body!: { 
    id: string;
    token: string;
    password: string;
  };
  
  protected rules() {
    return {
      id: Validator.string().required(),
      token: Validator.string().required(),
      password: Validator.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
        .message('"{#label}" must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)')
        .required()
    }
  }
}
