import { Request } from "~/core/express";
import Validator, { unique } from "Validator";
import { UploadedFile } from "express-fileupload";

export default class RegisterRequest extends Request {
  body!: { 
    username: string;
    email: string;
    password: string;
  };
  
  files!: {
    profile?: UploadedFile
  }
  
  static rules() {
    return {
      username: Validator.string().alphanum().min(3).max(12).external(unique("User", "username")).required(),
      email: Validator.string().email().external(unique("User", "email")).required(),
      password: Validator.string().password().required(),
      profile: Validator.file().parts(1).max(1).mimetypes(["image/jpeg", "image/png"])
    }
  }
}
