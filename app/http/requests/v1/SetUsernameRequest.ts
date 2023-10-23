import { Request } from "~/core/express";
import Validator, { unique } from "Validator";
import { UploadedFile } from "express-fileupload";

export default class SetUsernameRequest extends Request {
  body!: { 
    token: string;
    username: string;
  };
  

  static rules() {
    return {
      token: Validator.string().required(),
      username: Validator.string().alphanum().external(unique("User", "username")).required(),
    }
  }
}
