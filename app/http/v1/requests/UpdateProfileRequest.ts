import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import { UploadedFile } from "express-fileupload";

export default class UpdateProfileRequest extends AuthenticRequest {
  body!: { 
    username?: string;
    email?: string;
  };
  
  files!: {
    logo?: UploadedFile
  }

  static rules() {
    return {
      username: Validator.string().alphanum().min(3).max(12).unique("User", "username"),
      email: Validator.string().email().unique("User", "email"),
      logo: Validator.parts(1).max(1000*1000).mimetypes(["image/jpeg", "image/png"])
    }
  }
}
