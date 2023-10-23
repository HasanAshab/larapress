import { AuthenticRequest } from "~/core/express";
import Validator, { unique } from "Validator";
import { UploadedFile } from "express-fileupload";

export default class UpdateProfileRequest extends AuthenticRequest {
  body!: { 
    name?: string;
    username?: string;
    email?: string;
  };
  
  files!: {
    profile?: UploadedFile
  }

  static rules() {
    return {
      name: Validator.string().min(3).max(25).sanitize(),
      username: Validator.string().alphanum().min(3).max(12).external(unique("User", "username")),
      email: Validator.string().email().external(unique("User", "email")),
      profile: Validator.file().parts(1).max(1000*1000).mimetypes(["image/jpeg", "image/png"])
    }
  }
}
