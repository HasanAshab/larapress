import { AuthenticRequest } from "~/core/express";
import Validator, { unique } from "Validator";
import { UploadedFile } from "express-fileupload";

export default class UpdateCategoryRequest extends AuthenticRequest {
  body!: { 
    name?: string;
    slug?: string;
  };
  
  files!: {
    icon?: UploadedFile
  }

  static rules() {
    return {
      name: Validator.string(),
      slug: Validator.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).external(unique("Category", "slug")),
      icon: Validator.file().parts(1).max(1000*1000).mimetypes(["image/jpeg", "image/png"]),
    }
  }
}
