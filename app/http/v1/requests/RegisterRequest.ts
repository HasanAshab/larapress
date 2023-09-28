import { Request } from "~/core/express";
import Validator from "Validator";
import { UploadedFile } from "express-fileupload";

export default class RegisterRequest extends Request {
  body!: { 
    username: string;
    email: string;
    password: string;
  };
  
  files!: {
    logo?: UploadedFile
  }
  
  protected rules() {
    return {
      username: Validator.string().alphanum().min(3).max(12).required(),
      email: Validator.string().email().required(),
      password: Validator.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\.@$!%*?&])[A-Za-z\\d@$!%*?&]+$/)
        .message('"{#label}" must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)')
        .required(),
      logo: Validator.file().parts(1).max(1000*1000).mimetypes(["image/jpeg", "image/png"])
    }
  }
}
