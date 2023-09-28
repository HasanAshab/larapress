import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import { UploadedFile } from "express-fileupload";

export default class CreateCategoryRequest extends AuthenticRequest {
  body!: { 
    name: string;
    slug: string;
  };
  
  files!: {
    icon?: UploadedFile
  }

  protected rules() {
    return {
      name: Validator.string().required(),
      slug: Validator.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).unique("Category", "slug").required(),
      icon: Validator.file().parts(1).max(1000*1000).mimetypes(["image/jpeg", "image/png"]),
    }
  }
}
