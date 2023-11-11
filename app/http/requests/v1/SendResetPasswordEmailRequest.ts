import { Request } from "~/core/express";
import Validator from "Validator";

interface SendResetPasswordEmailRequest {
  body: { 
    email: string;
  }
}

class SendResetPasswordEmailRequest extends Request {
  static rules() {
    return {
      email: Validator.string().email().required()
    }
  }
}

export default  SendResetPasswordEmailRequest;