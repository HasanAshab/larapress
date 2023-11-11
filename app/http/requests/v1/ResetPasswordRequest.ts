import { Request } from "~/core/express";
import Validator from "Validator";

interface ResetPasswordRequest {
  body: { 
    id: string;
    token: string;
    password: string;
  }
}
class ResetPasswordRequest extends Request {
  static rules() {
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

export default ResetPasswordRequest;