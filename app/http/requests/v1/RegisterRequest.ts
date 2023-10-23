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
      password: Validator.string()
        .min(8)
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/)
        .message('{#label} must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)')
        .required(),
      profile: Validator.file().parts(1).max(1).mimetypes(["image/jpeg", "image/png"])
    }
  }
}
