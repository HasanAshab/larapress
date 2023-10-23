import { Request } from "~/core/express";
import Validator, { unique } from "Validator";
import { UploadedFile } from "express-fileupload";

export default class ExternalLoginFinalStepRequest extends Request {
  body!: { 
    externalId: string;
    token: string;
    username: string;
    email?: string;
  };
  

  static rules() {
    return {
      externalId: Validator.string().required(),
      token: Validator.string().required(),
      username: Validator.string().alphanum().external(unique("User", "username")).required(),
      email: Validator.string().email().external(unique("User", "email")),
    }
  }
}
